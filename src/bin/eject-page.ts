#!/usr/bin/env node

import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import cliSelect from 'cli-select';
import {
    type BuildContext,
    LOGIN_THEME_PAGE_IDS,
    ACCOUNT_THEME_PAGE_IDS,
    type LoginThemePageId,
    type AccountThemePageId,
    THEME_TYPES,
    type ThemeType
} from './core';
import * as fs from 'fs';
import {
    join as pathJoin,
    relative as pathRelative,
    sep as pathSep,
    dirname as pathDirname,
    posix as pathPosix,
    basename as pathBase
} from 'path';
import { assert, Equals } from 'tsafe/assert';
import chalk from 'chalk';
import { transformCodebase } from './tools/transformCodebase_async';
import { kebabCaseToCamelCase } from './tools/kebabCaseToSnakeCase';
import { replaceAll } from './tools/String.prototype.replaceAll';
import { capitalize } from 'tsafe/capitalize';
import { getIsPrettierAvailable, runPrettier } from './tools/runPrettier';

export async function command(params: { buildContext: BuildContext }) {
    const { buildContext } = params;

    console.log(chalk.cyan('Theme type:'));

    const themeType = await (async () => {
        const values = THEME_TYPES.filter(themeType => {
            switch (themeType) {
                case 'account':
                    return buildContext.implementedThemeTypes.account.isImplemented;
                case 'login':
                    return buildContext.implementedThemeTypes.login.isImplemented;
                case 'admin':
                    return false;
            }
            assert<Equals<typeof themeType, never>>(false);
        });

        assert(values.length > 0, 'No theme is implemented in this project');

        if (values.length === 1) {
            return values[0];
        }

        const { value } = await cliSelect<ThemeType>({
            values
        }).catch(() => {
            process.exit(-1);
        });

        return value;
    })();

    console.log(`→ ${themeType}`);

    console.log(chalk.cyan('Select the page you want to customize:'));

    const templateValue = 'template.ftl (Layout common to every page)';
    const userProfileFormFieldsValue =
        'user-profile-commons.ftl (Renders the form of the register.ftl, login-update-profile.ftl, update-email.ftl and idp-review-user-profile.ftl)';
    const otherPageValue = "The page you're looking for isn't listed here";

    const { value: pageIdOrComponent } = await cliSelect<
        | LoginThemePageId
        | AccountThemePageId
        | typeof templateValue
        | typeof userProfileFormFieldsValue
        | typeof otherPageValue
    >({
        values: (() => {
            switch (themeType) {
                case 'login':
                    return [
                        templateValue,
                        userProfileFormFieldsValue,
                        ...LOGIN_THEME_PAGE_IDS,
                        otherPageValue
                    ];
                case 'account':
                    return [templateValue, ...ACCOUNT_THEME_PAGE_IDS, otherPageValue];
                case 'admin':
                    return [];
            }
            assert<Equals<typeof themeType, never>>(false);
        })()
    }).catch(() => {
        process.exit(-1);
    });

    if (pageIdOrComponent === otherPageValue) {
        console.log(
            [
                'To style a page not included in the base Keycloak, such as one added by a third-party Keycloak extension,',
                'refer to the documentation: https://docs.keycloakify.dev/features/styling-a-custom-page-not-included-in-base-keycloak'
            ].join(' ')
        );

        process.exit(0);
    }

    console.log(`→ ${pageIdOrComponent}`);

    const componentRelativeDirPath_posix_to_componentRelativeFilePath_posix = (params: {
        componentRelativeDirPath_posix: string;
    }) => {
        const { componentRelativeDirPath_posix } = params;
        return `${componentRelativeDirPath_posix}/${pathPosix.basename(componentRelativeDirPath_posix)}.component`;
    };

    const componentDirRelativeToThemeTypePath = (() => {
        if (pageIdOrComponent === templateValue) {
            return pathJoin('template');
        }

        if (pageIdOrComponent === userProfileFormFieldsValue) {
            return pathJoin('components', 'user-profile-form-fields');
        }

        return pathJoin('pages', pageIdOrComponent.replace(/\.ftl$/, ''));
    })();

    {
        const componentDirRelativeToThemeTypePaths = [
            componentDirRelativeToThemeTypePath
        ];

        while (componentDirRelativeToThemeTypePaths.length !== 0) {
            const componentDirRelativeToThemeTypePath_i =
                componentDirRelativeToThemeTypePaths.pop();

            assert(componentDirRelativeToThemeTypePath_i !== undefined);

            const destDirPath = pathJoin(
                buildContext.themeSrcDirPath,
                themeType,
                componentDirRelativeToThemeTypePath_i
            );

            const dirName = pathBase(destDirPath);
            const tsFilePath = pathJoin(destDirPath, `${dirName}.component.ts`);
            if (fs.existsSync(destDirPath) && fs.readdirSync(destDirPath).length !== 0) {
                // Check if the directory contains a .ts file with the same name as the directory
                if (fs.existsSync(tsFilePath)) {
                    if (
                        componentDirRelativeToThemeTypePath_i ===
                        componentDirRelativeToThemeTypePath
                    ) {
                        console.log(
                            `${pageIdOrComponent.split('.ftl')[0]} is already ejected, ${pathRelative(
                                process.cwd(),
                                destDirPath
                            )} already exists and contains ${dirName}.ts`
                        );
                        process.exit(-1);
                    }
                    continue;
                }
            }

            const localThemeTypeDirPath = pathJoin(
                getThisCodebaseRootDirPath(),
                'src',
                themeType
            );

            await transformCodebase({
                srcDirPath: pathJoin(
                    localThemeTypeDirPath,
                    componentDirRelativeToThemeTypePath_i
                ),
                destDirPath,
                transformSourceCode: async ({
                    filePath,
                    fileRelativePath,
                    sourceCode
                }) => {
                    if (!filePath.endsWith('.ts')) {
                        let modifiedSourceCode_str = sourceCode.toString('utf8');

                        run_prettier: {
                            if (!(await getIsPrettierAvailable())) {
                                break run_prettier;
                            }

                            modifiedSourceCode_str = await runPrettier({
                                filePath: pathJoin(destDirPath, fileRelativePath),
                                sourceCode: modifiedSourceCode_str
                            });
                        }

                        return {
                            modifiedSourceCode: Buffer.from(
                                modifiedSourceCode_str,
                                'utf8'
                            )
                        };
                    }

                    if (filePath.endsWith('index.ts')) {
                        return undefined;
                    }

                    const fileRelativeToThemeTypePath = pathRelative(
                        localThemeTypeDirPath,
                        filePath
                    );

                    let modifiedSourceCode_str = sourceCode.toString();

                    const getPosixPathRelativeToFile = (params: {
                        pathRelativeToThemeType: string;
                    }) => {
                        const { pathRelativeToThemeType } = params;

                        const path = pathRelative(
                            pathDirname(fileRelativeToThemeTypePath),
                            pathRelativeToThemeType
                        )
                            .split(pathSep)
                            .join('/');

                        return path.startsWith('.') ? path : `./${path}`;
                    };

                    modifiedSourceCode_str = replaceAll(
                        modifiedSourceCode_str,
                        `@keycloakify/angular/${themeType}/i18n`,
                        getPosixPathRelativeToFile({
                            pathRelativeToThemeType: 'i18n'
                        })
                    );

                    modifiedSourceCode_str = replaceAll(
                        modifiedSourceCode_str,
                        `@keycloakify/angular/${themeType}/KcContext`,
                        getPosixPathRelativeToFile({
                            pathRelativeToThemeType: 'KcContext'
                        })
                    );

                    modifiedSourceCode_str = modifiedSourceCode_str.replace(
                        new RegExp(
                            `@keycloakify/angular/${themeType}/components/([^'"]+)`,
                            'g'
                        ),
                        (...[, componentDirRelativeToComponentsPath]) => {
                            const componentDirRelativeToThemeTypePath = pathJoin(
                                'components',
                                componentDirRelativeToComponentsPath
                            );

                            componentDirRelativeToThemeTypePaths.push(
                                componentDirRelativeToThemeTypePath
                            );

                            return componentRelativeDirPath_posix_to_componentRelativeFilePath_posix(
                                {
                                    componentRelativeDirPath_posix:
                                        getPosixPathRelativeToFile({
                                            pathRelativeToThemeType:
                                                componentDirRelativeToThemeTypePath
                                        })
                                }
                            );
                        }
                    );

                    run_prettier: {
                        if (!(await getIsPrettierAvailable())) {
                            break run_prettier;
                        }

                        modifiedSourceCode_str = await runPrettier({
                            filePath: pathJoin(destDirPath, fileRelativePath),
                            sourceCode: modifiedSourceCode_str
                        });
                    }

                    return {
                        modifiedSourceCode: Buffer.from(modifiedSourceCode_str, 'utf8')
                    };
                }
            });

            console.log(
                `${chalk.green('✓')} ${chalk.bold(
                    `.${pathSep}` + pathRelative(process.cwd(), destDirPath)
                )} moved from the @keycloakify/angular to your project`
            );
        }
    }

    edit_KcFiles: {
        if (
            pageIdOrComponent !== templateValue &&
            pageIdOrComponent !== userProfileFormFieldsValue
        ) {
            break edit_KcFiles;
        }

        const filesToProcess = ['KcPage.ts', 'KcPageStory.ts'];

        for (let fileName of filesToProcess) {
            const filePath = pathJoin(buildContext.themeSrcDirPath, themeType, fileName);

            if (!fs.existsSync(filePath)) {
                console.log(chalk.yellow(`${fileName} not found, skipping`));
                continue;
            }

            const originalCode = fs.readFileSync(filePath).toString('utf8');

            const modifiedCode = await (async () => {
                const componentRelativeDirPath_posix = componentDirRelativeToThemeTypePath
                    .split(pathSep)
                    .join('/');

                let sourceCode = originalCode.replace(
                    `@keycloakify/angular/${themeType}/${componentRelativeDirPath_posix}`,
                    componentRelativeDirPath_posix_to_componentRelativeFilePath_posix({
                        componentRelativeDirPath_posix: `./${componentRelativeDirPath_posix}`
                    })
                );

                run_prettier: {
                    if (!(await getIsPrettierAvailable())) {
                        break run_prettier;
                    }

                    sourceCode = await runPrettier({
                        filePath,
                        sourceCode
                    });
                }

                return sourceCode;
            })();

            if (modifiedCode === originalCode) {
                console.log(
                    chalk.red(
                        `Unable to automatically update ${fileName}, please update it manually`
                    )
                );
                continue;
            }

            fs.writeFileSync(filePath, Buffer.from(modifiedCode, 'utf8'));

            console.log(
                `${chalk.green('✓')} ${chalk.bold(
                    `.${pathSep}${pathRelative(process.cwd(), filePath)}`
                )} Updated`
            );
        }
        return;
    }

    const pageId = pageIdOrComponent;

    console.log(
        [
            ``,
            `You now need to update your page router:`,
            ``,
            `${chalk.bold(
                pathJoin(
                    '.',
                    pathRelative(process.cwd(), buildContext.themeSrcDirPath),
                    themeType,
                    'KcPage.ts'
                )
            )}:`,
            chalk.grey('```'),
            `// ...`,
            ``,
            ...(() => {
                let inGreenBlock = false;
                return [
                    ` export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {`,
                    `   switch (pageId) {`,
                    `+`,
                    `    case '${pageId}':`,
                    `      return {`,
                    `        PageComponent: (await import('${componentRelativeDirPath_posix_to_componentRelativeFilePath_posix(
                        {
                            componentRelativeDirPath_posix: `./${componentDirRelativeToThemeTypePath.split(pathSep).join('/')}`
                        }
                    )}')).${kebabCaseToCamelCase(capitalize(pageId).replace(/\.ftl$/, ''))}Component,`,
                    `        TemplateComponent,`,
                    ...(themeType === 'login'
                        ? [`        UserProfileFormFieldsComponent,`]
                        : []),
                    ...(themeType === 'login'
                        ? [`        doMakeUserConfirmPassword,`]
                        : []),
                    `        doUseDefaultCss,`,
                    `        classes,`,
                    `      };`,
                    `+`,
                    `     //...`,
                    `     default:`,
                    `       return {`,
                    `         PageComponent: await getDefaultPageComponent(pageId),`,
                    `         TemplateComponent,`,
                    ...(themeType === 'login'
                        ? [`         UserProfileFormFieldsComponent,`]
                        : []),
                    ...(themeType === 'login'
                        ? [`         doMakeUserConfirmPassword,`]
                        : []),
                    `         doUseDefaultCss,`,
                    `         classes,`,
                    `       };`,
                    `   }`,
                    ` }`
                ].map(line => {
                    if (line === `+`) {
                        inGreenBlock = !inGreenBlock;
                    }
                    if (inGreenBlock || line.startsWith('+')) {
                        return chalk.green(line);
                    }
                    if (line.startsWith('-')) {
                        return chalk.red(line);
                    }
                    return chalk.grey(line);
                });
            })(),
            chalk.grey('```')
        ].join('\n')
    );
}

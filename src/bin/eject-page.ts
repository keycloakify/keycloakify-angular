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
    dirname as pathDirname
} from 'path';
import { assert, Equals } from 'tsafe/assert';
import chalk from 'chalk';
import { transformCodebase } from './tools/transformCodebase';
import { kebabCaseToCamelCase } from './tools/kebabCaseToSnakeCase';
import { replaceAll } from './tools/String.prototype.replaceAll';
import { capitalize } from 'tsafe/capitalize';

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

    const { value: pageIdOrComponent } = await cliSelect<
        LoginThemePageId | AccountThemePageId | typeof templateValue
    >({
        values: (() => {
            switch (themeType) {
                case 'login':
                    return [templateValue, ...LOGIN_THEME_PAGE_IDS];
                case 'account':
                    return [templateValue, ...ACCOUNT_THEME_PAGE_IDS];
            }
            assert<Equals<typeof themeType, never>>(false);
        })()
    }).catch(() => {
        process.exit(-1);
    });

    console.log(`→ ${pageIdOrComponent}`);

    const componentDirRelativeToThemeTypePath = (() => {
        if (pageIdOrComponent === templateValue) {
            return pathJoin('containers', 'template');
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

            if (fs.existsSync(destDirPath) && fs.readdirSync(destDirPath).length !== 0) {
                if (
                    componentDirRelativeToThemeTypePath_i ===
                    componentDirRelativeToThemeTypePath
                ) {
                    console.log(
                        `${pageIdOrComponent.split('.ftl')[0]} is already ejected, ${pathRelative(
                            process.cwd(),
                            destDirPath
                        )} already exists`
                    );
                    process.exit(-1);
                }
                continue;
            }

            const localThemeTypeDirPath = pathJoin(
                getThisCodebaseRootDirPath(),
                'src',
                themeType
            );

            transformCodebase({
                srcDirPath: pathJoin(
                    localThemeTypeDirPath,
                    componentDirRelativeToThemeTypePath_i
                ),
                destDirPath,
                transformSourceCode: ({ filePath, sourceCode }) => {
                    if (!filePath.endsWith('.ts')) {
                        return { modifiedSourceCode: sourceCode };
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

                            return getPosixPathRelativeToFile({
                                pathRelativeToThemeType:
                                    componentDirRelativeToThemeTypePath
                            });
                        }
                    );

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

    edit_KcPage: {
        if (pageIdOrComponent !== templateValue) {
            break edit_KcPage;
        }

        const kcAppTsFilePath = pathJoin(
            buildContext.themeSrcDirPath,
            themeType,
            'KcPage.ts'
        );

        const kcAppTsCode = fs.readFileSync(kcAppTsFilePath).toString('utf8');

        const modifiedKcAppTsCode = (() => {
            const componentRelativeDirPath_posix = componentDirRelativeToThemeTypePath
                .split(pathSep)
                .join('/');

            return kcAppTsCode.replace(
                `@keycloakify/angular/${themeType}/${componentRelativeDirPath_posix}`,
                `./${componentRelativeDirPath_posix}`
            );
        })();

        if (modifiedKcAppTsCode === kcAppTsCode) {
            console.log(
                chalk.red(
                    'Unable to automatically update KcPage.tsx, please update it manually'
                )
            );
            return;
        }

        fs.writeFileSync(kcAppTsFilePath, Buffer.from(modifiedKcAppTsCode, 'utf8'));

        console.log(
            `${chalk.green('✓')} ${chalk.bold(
                `.${pathSep}` + pathRelative(process.cwd(), kcAppTsFilePath)
            )} Updated`
        );

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
            ...[
                ` export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {`,
                `   switch (pageId) {`,
                `+    case '${pageId}':`,
                `+      return {`,
                `+        PageComponent: (await import('./${componentDirRelativeToThemeTypePath.split(pathSep).join('/')}')).${kebabCaseToCamelCase(capitalize(pageId).replace(/\.ftl$/, ''))}Component,`,
                `+        TemplateComponent,`,
                ...(themeType === 'login' ? [`+        doMakeUserConfirmPassword,`] : []),
                `+        doUseDefaultCss,`,
                `+        classes,`,
                `+      };`,
                `     //...`,
                `     default:`,
                `       return {`,
                `         PageComponent: await getDefaultPageComponent(pageId),`,
                `         TemplateComponent,`,
                ...(themeType === 'login' ? [`         doMakeUserConfirmPassword,`] : []),
                `         doUseDefaultCss,`,
                `         classes,`,
                `       };`,
                `   }`,
                ` }`
            ].map(line => {
                if (line.startsWith('+')) {
                    return chalk.green(line);
                }
                if (line.startsWith('-')) {
                    return chalk.red(line);
                }
                return chalk.grey(line);
            }),
            chalk.grey('```')
        ].join('\n')
    );
}

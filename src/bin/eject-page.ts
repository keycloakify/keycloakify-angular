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
import { join as pathJoin, relative as pathRelative, sep as pathSep } from 'path';
import { assert, Equals } from 'tsafe/assert';
import chalk from 'chalk';
import { transformCodebase } from './tools/transformCodebase';
import { kebabCaseToCamelCase } from './tools/kebabCaseToSnakeCase';

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
    const userProfileFormFieldsValue =
        'user-profile-commons.ftl (Renders the form of the register.ftl, login-update-profile.ftl, update-email.ftl and idp-review-user-profile.ftl)';

    const { value: pageIdOrComponent } = await cliSelect<
        | LoginThemePageId
        | AccountThemePageId
        | typeof templateValue
        | typeof userProfileFormFieldsValue
    >({
        values: (() => {
            switch (themeType) {
                case 'login':
                    return [
                        templateValue,
                        userProfileFormFieldsValue,
                        ...LOGIN_THEME_PAGE_IDS
                    ];
                case 'account':
                    return [templateValue, ...ACCOUNT_THEME_PAGE_IDS];
            }
            assert<Equals<typeof themeType, never>>(false);
        })()
    }).catch(() => {
        process.exit(-1);
    });

    console.log(`→ ${pageIdOrComponent}`);

    const componentRelativeDirPath = (() => {
        if (pageIdOrComponent === templateValue) {
            return pathJoin('components', 'user-profile-form-fields');
        }

        if (pageIdOrComponent === userProfileFormFieldsValue) {
            return pathJoin('containers', 'template');
        }

        return pathJoin('pages', pageIdOrComponent.replace(/\.ftl$/, ''));
    })();

    const targetDirPath = pathJoin(
        buildContext.themeSrcDirPath,
        themeType,
        componentRelativeDirPath
    );

    if (fs.existsSync(targetDirPath)) {
        console.log(
            `${pageIdOrComponent} is already ejected, ${pathRelative(
                process.cwd(),
                targetDirPath
            )} already exists`
        );

        process.exit(-1);
    }

    transformCodebase({
        srcDirPath: pathJoin(
            getThisCodebaseRootDirPath(),
            'src',
            themeType,
            componentRelativeDirPath
        ),
        destDirPath: targetDirPath
    });

    console.log(
        `${chalk.green('✓')} ${chalk.bold(
            pathJoin('.', pathRelative(process.cwd(), targetDirPath))
        )} copy pasted from the @keycloakify/angular sources code into your project`
    );

    edit_KcPage: {
        if (
            pageIdOrComponent !== templateValue &&
            pageIdOrComponent !== userProfileFormFieldsValue
        ) {
            break edit_KcPage;
        }

        const kcAppTsFilePath = pathJoin(
            buildContext.themeSrcDirPath,
            themeType,
            'KcPage.ts'
        );

        const kcAppTsCode = fs.readFileSync(kcAppTsFilePath).toString('utf8');

        const modifiedKcAppTsxCode = (() => {
            const componentRelativeDirPath_posix = componentRelativeDirPath
                .split(pathSep)
                .join('/');

            return kcAppTsCode.replace(
                `@keycloakify/angular/${themeType}/${componentRelativeDirPath_posix}`,
                `./${componentRelativeDirPath_posix}`
            );
        })();

        if (modifiedKcAppTsxCode === kcAppTsCode) {
            console.log(
                chalk.red(
                    'Unable to automatically update KcPage.tsx, please update it manually'
                )
            );
            return;
        }

        fs.writeFileSync(kcAppTsCode, Buffer.from(modifiedKcAppTsxCode, 'utf8'));

        console.log(
            `${chalk.green('✓')} ${chalk.bold(
                pathJoin('.', pathRelative(process.cwd(), kcAppTsCode))
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
                `+        PageComponent: (await import('.${componentRelativeDirPath.split(pathSep).join('/')}')).${kebabCaseToCamelCase(pageId.replace(/\.ftl$/, ''))}Component,`,
                `+        TemplateComponent,`,
                `+        UserProfileFormFieldsComponent,`,
                `+        doMakeUserConfirmPassword,`,
                `+        doUseDefaultCss,`,
                `+        classes,`,
                `+      };`,
                `     //...`,
                `     default:`,
                `       return {`,
                `         PageComponent: await getDefaultPageComponent(pageId),`,
                `         TemplateComponent,`,
                `         UserProfileFormFieldsComponent,`,
                `         doMakeUserConfirmPassword,`,
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

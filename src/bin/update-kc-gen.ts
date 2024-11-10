import type { BuildContext } from './core';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { getIsPrettierAvailable, runPrettier } from './tools/runPrettier';
import * as crypto from 'crypto';

export async function command(params: { buildContext: BuildContext }) {
    const { buildContext } = params;

    const filePath = pathJoin(buildContext.themeSrcDirPath, 'kc.gen.ts');

    const implementedThemeTypes = (['login', 'account'] as const).filter(
        themeType => buildContext.implementedThemeTypes[themeType].isImplemented
    );

    const newContent = [
        ``,
        `/* eslint-disable */`,
        ``,
        `// @ts-nocheck`,
        ``,
        `// noinspection JSUnusedGlobalSymbols`,
        ``,
        `import type { ComponentRef, EnvironmentProviders, Type } from "@angular/core";`,
        ``,
        `export type ThemeName = ${buildContext.themeNames.map(themeName => `"${themeName}"`).join(' | ')};`,
        ``,
        `export const themeNames: ThemeName[] = [${buildContext.themeNames.map(themeName => `"${themeName}"`).join(', ')}];`,
        ``,
        `export type KcEnvName = ${buildContext.environmentVariables.length === 0 ? 'never' : buildContext.environmentVariables.map(({ name }) => `"${name}"`).join(' | ')};`,
        ``,
        `export const kcEnvNames: KcEnvName[] = [${buildContext.environmentVariables.map(({ name }) => `"${name}"`).join(', ')}];`,
        ``,
        `export const kcEnvDefaults: Record<KcEnvName, string> = ${JSON.stringify(
            Object.fromEntries(
                buildContext.environmentVariables.map(
                    ({ name, default: defaultValue }) => [name, defaultValue]
                )
            ),
            null,
            2
        )};`,
        ``,
        `export type KcContext =`,
        ...implementedThemeTypes.map(
            themeType => `    | import("./${themeType}/KcContext").KcContext`
        ),
        `    ;`,
        ``,
        `declare global {`,
        `    interface Window {`,
        `        kcContext?: KcContext;`,
        `    }`,
        `}`,
        ``,
        `type ApplicationRefLike = {`,
        `    components: ComponentRef<any>[];`,
        `};`,
        ``,
        `export async function bootstrapKcApplication(params: {`,
        `    kcContext: KcContext;`,
        `    bootstrapApplication: (params: {`,
        `        KcRootComponent: Type<unknown>;`,
        `        kcProvider: EnvironmentProviders;`,
        `    }) => Promise<ApplicationRefLike>;`,
        `}) {`,
        `    const { kcContext, bootstrapApplication } = params;`,
        ``,
        `    switch (kcContext.themeType) {`,
        ...(['login', 'account'] as const)
            .filter(
                themeType => buildContext.implementedThemeTypes[themeType].isImplemented
            )
            .map(themeType => [
                `        case "${themeType}":`,
                `            {`,
                `                const [`,
                `                    { provideKeycloakifyAngular },`,
                `                    { getI18n },`,
                `                    {`,
                `                        PageComponent,`,
                `                        TemplateComponent,`,
                `                        doUseDefaultCss,`,
                `                        classes,`,
                ...(themeType === 'login'
                    ? [
                          `                        UserProfileFormFieldsComponent,`,
                          `                        doMakeUserConfirmPassword,`
                      ]
                    : []),
                `                    },`,
                `                ] = await Promise.all([`,
                `                    import('@keycloakify/angular/login/providers/keycloakify-angular'),`,
                `                    import('./${themeType}/i18n'),`,
                `                    import('./${themeType}/KcPage').then(({ getKcPage }) => getKcPage(kcContext.pageId)),`,
                `                ] as const);`,
                ``,
                `                const appRef = await bootstrapApplication({`,
                `                    KcRootComponent: TemplateComponent,`,
                `                    kcProvider: provideKeycloakifyAngular({`,
                `                        kcContext,`,
                `                        classes,`,
                `                        getI18n,`,
                `                        doUseDefaultCss,`,
                ...(themeType === 'login'
                    ? [`                        doMakeUserConfirmPassword,`]
                    : []),
                `                    })`,
                `                });`,
                ``,
                `                appRef.components.forEach(componentRef => {`,
                `                    // page must be defined first          `,
                `                    if ("page" in componentRef.instance) {`,
                `                        componentRef.setInput("page", PageComponent);`,
                `                    }`,
                ...(themeType === 'login'
                    ? [
                          `                    if ("userProfileFormFields" in componentRef.instance) {`,
                          `                        componentRef.setInput(`,
                          `                            "userProfileFormFields",`,
                          `                            UserProfileFormFieldsComponent`,
                          `                        );`,
                          `                    }`
                      ]
                    : []),
                `                });`,
                `            }`,
                `            break;`
            ])
            .flat(),
        `    }`,
        `}`,
        ``
    ].join('\n');

    const hash = crypto.createHash('sha256').update(newContent).digest('hex');

    skip_if_no_changes: {
        if (!fs.existsSync(filePath)) {
            break skip_if_no_changes;
        }

        const currentContent = fs.readFileSync(filePath).toString('utf8');

        if (!currentContent.includes(hash)) {
            break skip_if_no_changes;
        }

        return;
    }

    let sourceCode = [
        `// This file is auto-generated by keycloakify. Do not edit it manually.`,
        `// Hash: ${hash}`,
        ``,
        newContent
    ].join('\n');

    run_prettier: {
        if (!(await getIsPrettierAvailable())) {
            break run_prettier;
        }

        sourceCode = await runPrettier({
            filePath,
            sourceCode
        });
    }

    fs.writeFileSync(filePath, Buffer.from(sourceCode, 'utf8'));
}

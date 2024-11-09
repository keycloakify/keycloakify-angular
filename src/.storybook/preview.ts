import '@angular/compiler';

import { type Preview } from '@storybook/angular';
import { provideKeycloakifyAngular as provideKeycloakifyLogin } from '@keycloakify/angular/login/providers/keycloakify-angular';
import { getKcContextMock as getKcContextMockLogin } from '@keycloakify/angular/stories/login/KcContextMock';
import { getI18n as getI18nLogin } from '@keycloakify/angular/stories/login/i18n';

// Import the account-specific modules
import { provideKeycloakifyAngular as provideKeycloakifyAccount } from '@keycloakify/angular/account/providers/keycloakify-angular';
import { getKcContextMock as getKcContextMockAccount } from '@keycloakify/angular/stories/account/KcContextMock';
import { getI18n as getI18nAccount } from '@keycloakify/angular/stories/account/i18n';

const preview: Preview = {
    decorators: [
        (_, context) => {
            if (context.title.includes('login/')) {
                return {
                    applicationConfig: {
                        providers: [
                            provideKeycloakifyLogin({
                                doUseDefaultCss: false,
                                classes: {},
                                kcContext: getKcContextMockLogin({
                                    pageId: context.globals['pageId'],
                                    overrides: context.globals['overrides']
                                }),
                                getI18n: getI18nLogin
                            })
                        ]
                    }
                };
            } else {
                return {
                    applicationConfig: {
                        providers: [
                            provideKeycloakifyAccount({
                                doUseDefaultCss: false,
                                classes: {},
                                kcContext: getKcContextMockAccount({
                                    pageId: context.globals['pageId'],
                                    overrides: context.globals['overrides']
                                }),
                                getI18n: getI18nAccount
                            })
                        ]
                    }
                };
            }
        }
    ]
};

export default preview;

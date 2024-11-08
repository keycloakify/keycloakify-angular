/* eslint-disable @typescript-eslint/no-explicit-any */
import '@angular/compiler';

import { type Preview } from '@storybook/angular';
import { LOGIN_THEME_PAGE_IDS } from 'keycloakify/bin/shared/constants';
import { provideKeycloakifyAngular } from '@keycloakify/angular/login/providers/keycloakify-angular';
import { getKcContextMock } from '@keycloakify/angular/stories/login/KcContextMock';
import { getI18n } from '@keycloakify/angular/stories/login/i18n';

const preview: Preview = {
    decorators: [
        (_, context) => {
            return {
                applicationConfig: {
                    providers: [
                        provideKeycloakifyAngular({
                            doUseDefaultCss: false,
                            classes: {},
                            kcContext: getKcContextMock({
                                pageId: context.globals['pageId'],
                                overrides: context.globals['overrides']
                            }),
                            getI18n: getI18n
                        })
                    ]
                }
            };
        }
    ]
};

export default preview;

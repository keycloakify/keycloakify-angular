import {
    LOCALE_ID,
    makeEnvironmentProviders,
    inject,
    provideAppInitializer,
    DOCUMENT
} from '@angular/core';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { I18nService } from '@keycloakify/angular/account/services/i18n';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { KcContextLike } from 'keycloakify/account/i18n/noJsx';
import type { ClassKey } from 'keycloakify/account/lib/kcClsx';

export type KeycloakifyAngularAccountConfig = {
    doUseDefaultCss?: boolean;
    classes?: { [key in ClassKey]?: string };
    kcContext: unknown;
    getI18n: (params: { kcContext: KcContextLike }) => {
        i18n: unknown;
        prI18n_currentLanguage: Promise<unknown> | undefined;
    };
};

export const provideKeycloakifyAngular = (config: KeycloakifyAngularAccountConfig) =>
    makeEnvironmentProviders([
        {
            provide: KC_ACCOUNT_CONTEXT,
            useValue: config.kcContext
        },
        {
            provide: LOCALE_ID,
            useFactory: (document: Document) => {
                return document.documentElement.lang ?? 'en';
            },
            deps: [DOCUMENT]
        },
        provideAppInitializer(() => {
            const i18nService: I18nService = inject(I18nService);
            const kcContext = inject<KcContext>(KC_ACCOUNT_CONTEXT);
            const getI18n = config.getI18n;

            const { i18n, prI18n_currentLanguage } = getI18n({
                kcContext
            });
            let i18nPromise = new Promise<typeof i18n>(resolve => resolve(i18n));
            if (prI18n_currentLanguage) {
                i18nPromise = prI18n_currentLanguage;
            }
            return i18nPromise.then(i18n => {
                i18nService.i18n = i18n;
                return true;
            });
        }),
        {
            provide: ACCOUNT_I18N,
            useFactory: (i18nService: I18nService) => i18nService.i18n,
            deps: [I18nService]
        },
        { provide: USE_DEFAULT_CSS, useValue: config?.doUseDefaultCss ?? true },
        { provide: ACCOUNT_CLASSES, useValue: config?.classes ?? {} }
    ]);

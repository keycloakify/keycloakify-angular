import {
    LOCALE_ID,
    makeEnvironmentProviders,
    inject,
    provideAppInitializer,
    DOCUMENT
} from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { I18nService } from '@keycloakify/angular/login/services/i18n';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password';
import { type KcContextLike } from 'keycloakify/login/i18n/noJsx';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

export type KeycloakifyAngularLoginConfig = {
    doMakeUserConfirmPassword?: boolean;
    doUseDefaultCss?: boolean;
    classes?: { [key in ClassKey]?: string };
    kcContext: unknown;
    getI18n: (params: { kcContext: KcContextLike }) => {
        i18n: unknown;
        prI18n_currentLanguage: Promise<unknown> | undefined;
    };
};

export const provideKeycloakifyAngular = (config: KeycloakifyAngularLoginConfig) =>
    makeEnvironmentProviders([
        {
            provide: KC_LOGIN_CONTEXT,
            useValue: config.kcContext
        },
        {
            provide: DO_MAKE_USER_CONFIRM_PASSWORD,
            useValue: config?.doMakeUserConfirmPassword ?? true
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
            const kcContext: KcContext = inject(KC_LOGIN_CONTEXT);
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
            provide: LOGIN_I18N,
            useFactory: (i18nService: I18nService) => i18nService.i18n,
            deps: [I18nService]
        },
        { provide: USE_DEFAULT_CSS, useValue: config?.doUseDefaultCss ?? true },
        { provide: LOGIN_CLASSES, useValue: config?.classes ?? {} }
    ]);

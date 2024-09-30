import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, LOCALE_ID, makeEnvironmentProviders } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password.token';
import { type KcContextLike } from 'keycloakify/login/i18n/noJsx';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type KcContext } from '../KcContext';
import { I18nService } from '@keycloakify/angular/login/services/i18n.service';

export type KeycloakifyAngularLoginConfig = {
    doMakeUserConfirmPassword?: boolean;
    doUseDefaultCss?: boolean;
    classes?: { [key in ClassKey]?: string };
    getI18n: (params: { kcContext: KcContextLike }) => {
        i18n: unknown;
        prI18n_currentLanguage: Promise<unknown> | undefined;
    };
};

export const provideKeycloakifyAngularLogin = (config: KeycloakifyAngularLoginConfig) =>
    makeEnvironmentProviders([
        {
            provide: KC_LOGIN_CONTEXT,
            // @ts-ignore
            useValue: window.kcContext
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
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: (i18nService: I18nService, kcContext: KcContext) => async () => {
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
            },
            deps: [I18nService, KC_LOGIN_CONTEXT]
        },
        {
            provide: LOGIN_I18N,
            useFactory: (i18nService: I18nService) => i18nService.i18n,
            deps: [I18nService]
        },
        { provide: USE_DEFAULT_CSS, useValue: config?.doUseDefaultCss ?? true },
        { provide: LOGIN_CLASSES, useValue: config?.classes ?? {} }
    ]);

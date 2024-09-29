import { DOCUMENT } from "@angular/common";
import {
    APP_INITIALIZER,
    InjectionToken,
    LOCALE_ID,
    makeEnvironmentProviders
} from "@angular/core";
import { I18n } from "../i18n";
import { I18nService } from "../services";

export const I18N = new InjectionToken<I18n>("i18n");
export const KC_CONTEXT = new InjectionToken<KcContext>("keycloak context");
export const USE_DEFAULT_CSS = new InjectionToken<boolean>("use default css");
export const CLASSES = new InjectionToken<{ [key in ClassKey]?: string }>("classes");
export const DO_MAKE_USER_CONFIRM_PASSWORD = new InjectionToken<boolean>(
    "doMakeUserConfirmPassword"
);

type ClassKey =
    | import("keycloakify/login").ClassKey
    | import("keycloakify/account").ClassKey;
type KcContextLike =
    | import("keycloakify/login/i18n").KcContextLike
    | import("keycloakify/account/i18n").KcContextLike;
type KcContext =
    | import("keycloakify/login/KcContext").KcContext
    | import("keycloakify/account/KcContext").KcContext;

export type KeycloakifyAngularConfig = {
    doMakeUserConfirmPassword?: boolean;
    doUseDefaultCss?: boolean;
    classes?: { [key in ClassKey]?: string };
    getI18n: (params: { kcContext: KcContextLike }) => {
        i18n: unknown;
        prI18n_currentLanguage: Promise<unknown> | undefined;
    };
};

export const provideKeycloakifyAngular = (config: KeycloakifyAngularConfig) =>
    makeEnvironmentProviders([
        {
            provide: KC_CONTEXT,
            useValue: window.kcContext
        },
        {
            provide: DO_MAKE_USER_CONFIRM_PASSWORD,
            useValue: config?.doMakeUserConfirmPassword ?? true
        },
        {
            provide: LOCALE_ID,
            useFactory: (document: Document) => {
                return document.documentElement.lang ?? "en";
            },
            deps: [DOCUMENT]
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory:
                (
                    i18nService: I18nService<ReturnType<typeof config.getI18n>["i18n"]>,
                    kcContext: KcContext
                ) =>
                async () => {
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
            deps: [I18nService, KC_CONTEXT]
        },
        { provide: USE_DEFAULT_CSS, useValue: config?.doUseDefaultCss ?? true },
        { provide: CLASSES, useValue: config?.classes ?? {} },
        {
            provide: I18N,
            useFactory: (
                i18nService: I18nService<ReturnType<typeof config.getI18n>["i18n"]>
            ) => {
                return i18nService.i18n;
            },
            deps: [I18nService]
        }
    ]);

import { i18nBuilder } from '@keycloakify/angular/account';
import { ThemeName } from '../kc.gen';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { getI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withExtraLanguages({}) // See: https://docs.keycloakify.dev/i18n/adding-support-for-extra-languages
    .withCustomTranslations({}) // See: https://docs.keycloakify.dev/i18n/adding-new-translation-messages-or-changing-the-default-ones
    .build();
type I18n = typeof ofTypeI18n;
export { getI18n, type I18n };

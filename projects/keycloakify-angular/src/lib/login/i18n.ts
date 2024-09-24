import { i18nBuilder } from 'keycloakify/login/i18n/noJsx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { ofTypeI18n } = i18nBuilder.build();
type I18n = typeof ofTypeI18n;
export { type I18n };

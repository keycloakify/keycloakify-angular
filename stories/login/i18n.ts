import { i18nBuilder } from 'keycloakify/login/i18n/noJsx';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { getI18n, ofTypeI18n } = i18nBuilder.build();

type I18n = typeof ofTypeI18n;

export { getI18n, type I18n };

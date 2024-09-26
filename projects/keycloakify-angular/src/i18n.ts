/* eslint-disable @typescript-eslint/no-unused-vars */

import { i18nBuilder as loginI18nBuilder } from 'keycloakify/login/i18n/noJsx';
import { i18nBuilder as accountI18nBuilder } from 'keycloakify/account/i18n/noJsx';

const { ofTypeI18n: I18nlogin } = loginI18nBuilder.build();
const { ofTypeI18n: I18nAccount } = accountI18nBuilder.build();
type I18n = typeof I18nAccount | typeof I18nlogin;
export { type I18n };

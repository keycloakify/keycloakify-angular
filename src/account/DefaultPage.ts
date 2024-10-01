import { Type } from '@angular/core';
import { type ClassKey } from 'keycloakify/account';
import { type KcContext } from './KcContext';

const DefaultPage = async (
  pageId: KcContext['pageId'],
  doUseDefaultCss = true,
  classes: { [key in ClassKey]?: string } = {},
): Promise<{
  ComponentBootstrap: Type<unknown>;
  doMakeUserConfirmPassword: boolean;
  doUseDefaultCss: boolean;
  classes: { [key in ClassKey]?: string };
}> => {
  let ComponentBootstrapPromise;
  switch (pageId) {
    case 'password.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/password/password.component').then((c) => c.PasswordComponent);
      break;
    case 'account.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/account/account.component').then((c) => c.AccountComponent);
      break;
    case 'sessions.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/sessions/sessions.component').then((c) => c.SessionsComponent);
      break;
    case 'totp.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/totp/totp.component').then((c) => c.TotpComponent);
      break;
    case 'applications.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/applications/applications.component').then(
        (c) => c.ApplicationsComponent,
      );
      break;
    case 'log.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/log/log.component').then((c) => c.LogComponent);
      break;
    case 'federatedIdentity.ftl':
      ComponentBootstrapPromise = import('@keycloakify/angular/account/pages/federatedIdentity/federatedIdentity.component').then(
        (c) => c.FederatedIdentityComponent,
      );
      break;
  }
  return ComponentBootstrapPromise?.then((ComponentBootstrap) => ({
    ComponentBootstrap,
    doMakeUserConfirmPassword: false,
    doUseDefaultCss,
    classes,
  }));
};

export { DefaultPage };

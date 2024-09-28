import { Type } from '@angular/core';
import { ClassKey } from 'keycloakify/account';
import { KcContext } from 'keycloakify/account/KcContext';

const DefaultPage = async (
  pageId: KcContext['pageId'],
  active = true,
  doUseDefaultCss = true,
  classes: { [key in ClassKey]?: string } = {},
): Promise<{
  ComponentBootstrap: Type<unknown>;
  active: boolean;
  doUseDefaultCss: boolean;
  classes: { [key in ClassKey]?: string };
}> => {
  let ComponentBootstrapPromise;
  switch (pageId) {
    case 'password.ftl':
      ComponentBootstrapPromise = import('./pages/password/password.component').then((c) => c.PasswordComponent);
      break;
    case 'account.ftl':
      ComponentBootstrapPromise = import('./pages/account/account.component').then((c) => c.AccountComponent);
      break;
    case 'sessions.ftl':
      ComponentBootstrapPromise = import('./pages/sessions/sessions.component').then((c) => c.SessionsComponent);
      break;
    case 'totp.ftl':
      ComponentBootstrapPromise = import('./pages/totp/totp.component').then((c) => c.TotpComponent);
      break;
    case 'applications.ftl':
      ComponentBootstrapPromise = import('./pages/applications/applications.component').then(
        (c) => c.ApplicationsComponent,
      );
      break;
    case 'log.ftl':
      ComponentBootstrapPromise = import('./pages/log/log.component').then((c) => c.LogComponent);
      break;
    case 'federatedIdentity.ftl':
      ComponentBootstrapPromise = import('./pages/federatedIdentity/federatedIdentity.component').then(
        (c) => c.FederatedIdentityComponent,
      );
      break;
  }
  return ComponentBootstrapPromise?.then((ComponentBootstrap) => ({
    ComponentBootstrap,
    active,
    doUseDefaultCss,
    classes,
  }));
};

export { DefaultPage };

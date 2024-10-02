import { Type } from '@angular/core';
import type { ClassKey } from 'keycloakify/account';
import type { KcContext } from '@keycloakify/angular/account/KcContext';

const DefaultPage = async (
    pageId: KcContext['pageId'],
    doUseDefaultCss = true,
    classes: { [key in ClassKey]?: string } = {}
): Promise<{
    ComponentBootstrap: Type<unknown>;
    doMakeUserConfirmPassword: boolean;
    doUseDefaultCss: boolean;
    classes: { [key in ClassKey]?: string };
}> => {
    let ComponentBootstrapPromise;
    switch (pageId) {
        case 'password.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/password'
            ).then(c => c.PasswordComponent);
            break;
        case 'account.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/account'
            ).then(c => c.AccountComponent);
            break;
        case 'sessions.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/sessions'
            ).then(c => c.SessionsComponent);
            break;
        case 'totp.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/totp'
            ).then(c => c.TotpComponent);
            break;
        case 'applications.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/applications'
            ).then(c => c.ApplicationsComponent);
            break;
        case 'log.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/log'
            ).then(c => c.LogComponent);
            break;
        case 'federatedIdentity.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/account/pages/federatedIdentity'
            ).then(c => c.FederatedIdentityComponent);
            break;
    }
    return ComponentBootstrapPromise?.then(ComponentBootstrap => ({
        ComponentBootstrap,
        doMakeUserConfirmPassword: false,
        doUseDefaultCss,
        classes
    }));
};

export { DefaultPage };

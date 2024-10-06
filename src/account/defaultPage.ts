import type { Type } from '@angular/core';
import type { KcContext } from '@keycloakify/angular/account/KcContext';

export function getDefaultPageComponent(
    pageId: KcContext['pageId']
): Promise<Type<unknown>> {
    switch (pageId) {
        case 'password.ftl':
            return import('@keycloakify/angular/account/pages/password').then(
                c => c.PasswordComponent
            );
            break;
        case 'account.ftl':
            return import('@keycloakify/angular/account/pages/account').then(
                c => c.AccountComponent
            );
            break;
        case 'sessions.ftl':
            return import('@keycloakify/angular/account/pages/sessions').then(
                c => c.SessionsComponent
            );
            break;
        case 'totp.ftl':
            return import('@keycloakify/angular/account/pages/totp').then(
                c => c.TotpComponent
            );
            break;
        case 'applications.ftl':
            return import('@keycloakify/angular/account/pages/applications').then(
                c => c.ApplicationsComponent
            );
            break;
        case 'log.ftl':
            return import('@keycloakify/angular/account/pages/log').then(
                c => c.LogComponent
            );
            break;
        case 'federatedIdentity.ftl':
            return import('@keycloakify/angular/account/pages/federatedIdentity').then(
                c => c.FederatedIdentityComponent
            );
            break;
    }
}

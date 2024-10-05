import type { Type } from '@angular/core';
import type { KcContext } from '@keycloakify/angular/login/KcContext';

export function getDefaultPageComponent(
    pageId: KcContext['pageId']
): Promise<Type<unknown>> {
    switch (pageId) {
        case 'login.ftl':
            return import('@keycloakify/angular/login/pages/login').then(
                c => c.LoginComponent
            );
        case 'login-username.ftl':
            return import('@keycloakify/angular/login/pages/login-username').then(
                c => c.LoginUsernameComponent
            );
        case 'login-password.ftl':
            return import('@keycloakify/angular/login/pages/login-password').then(
                c => c.LoginPasswordComponent
            );
        case 'webauthn-authenticate.ftl':
            return import('@keycloakify/angular/login/pages/webauthn-authenticate').then(
                c => c.WebauthnAuthenticateComponent
            );
        case 'webauthn-register.ftl':
            return import('@keycloakify/angular/login/pages/webauthn-register').then(
                c => c.WebauthnRegisterComponent
            );
        case 'register.ftl':
            return import('@keycloakify/angular/login/pages/register').then(
                c => c.RegisterComponent
            );
        case 'info.ftl':
            return import('@keycloakify/angular/login/pages/info').then(
                c => c.InfoComponent
            );
        case 'error.ftl':
            return import('@keycloakify/angular/login/pages/error').then(
                c => c.ErrorComponent
            );
        case 'login-reset-password.ftl':
            return import('@keycloakify/angular/login/pages/login-reset-password').then(
                c => c.LoginResetPasswordComponent
            );
        case 'login-verify-email.ftl':
            return import('@keycloakify/angular/login/pages/login-verify-email').then(
                c => c.LoginVerifyEmailComponent
            );
        case 'terms.ftl':
            return import('@keycloakify/angular/login/pages/terms').then(
                c => c.TermsComponent
            );
        case 'login-oauth2-device-verify-user-code.ftl':
            return import(
                '@keycloakify/angular/login/pages/login-oauth2-device-verify-user-code'
            ).then(c => c.LoginOauth2DeviceVerifyUserCodeComponent);
        case 'login-oauth-grant.ftl':
            return import('@keycloakify/angular/login/pages/login-oauth-grant').then(
                c => c.LoginOauthGrantComponent
            );
        case 'login-otp.ftl':
            return import('@keycloakify/angular/login/pages/login-otp').then(
                c => c.LoginOtpComponent
            );
        case 'login-update-profile.ftl':
            return import('@keycloakify/angular/login/pages/login-update-profile').then(
                c => c.LoginUpdateProfileComponent
            );
        case 'login-update-password.ftl':
            return import('@keycloakify/angular/login/pages/login-update-password').then(
                c => c.LoginUpdatePasswordComponent
            );
        case 'login-idp-link-confirm.ftl':
            return import('@keycloakify/angular/login/pages/login-idp-link-confirm').then(
                c => c.LoginIdpLinkConfirmComponent
            );
        case 'login-idp-link-email.ftl':
            return import('@keycloakify/angular/login/pages/login-idp-link-email').then(
                c => c.LoginIdpLinkEmailComponent
            );
        case 'login-page-expired.ftl':
            return import('@keycloakify/angular/login/pages/login-page-expired').then(
                c => c.LoginPageExpiredComponent
            );
        case 'login-config-totp.ftl':
            return import('@keycloakify/angular/login/pages/login-config-totp').then(
                c => c.LoginConfigTotpComponent
            );
        case 'logout-confirm.ftl':
            return import('@keycloakify/angular/login/pages/logout-confirm').then(
                c => c.LogoutConfirmComponent
            );
        case 'idp-review-user-profile.ftl':
            return import(
                '@keycloakify/angular/login/pages/idp-review-user-profile'
            ).then(c => c.IdpReviewUserProfileComponent);
        case 'update-email.ftl':
            return import('@keycloakify/angular/login/pages/update-email').then(
                c => c.UpdateEmailComponent
            );
        case 'select-authenticator.ftl':
            return import('@keycloakify/angular/login/pages/select-authenticator').then(
                c => c.SelectAuthenticatorComponent
            );
        case 'saml-post-form.ftl':
            return import('@keycloakify/angular/login/pages/saml-post-form').then(
                c => c.SamlPostFormComponent
            );
        case 'delete-credential.ftl':
            return import('@keycloakify/angular/login/pages/delete-credential').then(
                c => c.DeleteCredentialComponent
            );
        case 'code.ftl':
            return import('@keycloakify/angular/login/pages/code').then(
                c => c.CodeComponent
            );
        case 'delete-account-confirm.ftl':
            return import('@keycloakify/angular/login/pages/delete-account-confirm').then(
                c => c.DeleteAccountConfirmComponent
            );
        case 'frontchannel-logout.ftl':
            return import('@keycloakify/angular/login/pages/frontchannel-logout').then(
                c => c.FrontchannelLogoutComponent
            );
        case 'login-recovery-authn-code-config.ftl':
            return import(
                '@keycloakify/angular/login/pages/login-recovery-authn-code-config'
            ).then(c => c.LoginRecoveryAuthnCodeConfigComponent);
        case 'login-recovery-authn-code-input.ftl':
            return import(
                '@keycloakify/angular/login/pages/login-recovery-authn-code-input'
            ).then(c => c.LoginRecoveryAuthnCodeInputComponent);
        case 'login-reset-otp.ftl':
            return import('@keycloakify/angular/login/pages/login-reset-otp').then(
                c => c.LoginResetOtpComponent
            );
        case 'login-x509-info.ftl':
            return import('@keycloakify/angular/login/pages/login-x509-info').then(
                c => c.LoginX509InfoComponent
            );
        case 'webauthn-error.ftl':
            return import('@keycloakify/angular/login/pages/webauthn-error').then(
                c => c.WebauthnErrorComponent
            );
        case 'login-passkeys-conditional-authenticate.ftl':
            return import(
                '@keycloakify/angular/login/pages/login-passkeys-conditional-authenticate'
            ).then(c => c.LoginPasskeysConditionalAuthenticateComponent);
        case 'login-idp-link-confirm-override.ftl':
            return import(
                '@keycloakify/angular/login/pages/login-idp-link-confirm-override'
            ).then(c => c.LoginIdpLinkConfirmOverrideComponent);
    }
}

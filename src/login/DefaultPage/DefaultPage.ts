import { Type } from '@angular/core';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { KcContext } from '@keycloakify/angular/login/KcContext';

const DefaultPage = async (
    pageId: KcContext['pageId'],
    doMakeUserConfirmPassword = true,
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
        case 'login.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login'
            ).then(c => c.LoginComponent);
            break;
        case 'login-username.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-username'
            ).then(c => c.LoginUsernameComponent);
            break;
        case 'login-password.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-password'
            ).then(c => c.LoginPasswordComponent);
            break;
        case 'webauthn-authenticate.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/webauthn-authenticate'
            ).then(c => c.WebauthnAuthenticateComponent);
            break;
        case 'webauthn-register.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/webauthn-register'
            ).then(c => c.WebauthnRegisterComponent);
            break;
        case 'register.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/register'
            ).then(c => c.RegisterComponent);
            break;
        case 'info.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/info'
            ).then(c => c.InfoComponent);
            break;
        case 'error.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/error'
            ).then(c => c.ErrorComponent);
            break;
        case 'login-reset-password.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-reset-password'
            ).then(c => c.LoginResetPasswordComponent);
            break;
        case 'login-verify-email.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-verify-email'
            ).then(c => c.LoginVerifyEmailComponent);
            break;
        case 'terms.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/terms'
            ).then(c => c.TermsComponent);
            break;
        case 'login-oauth2-device-verify-user-code.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-oauth2-device-verify-user-code'
            ).then(c => c.LoginOauth2DeviceVerifyUserCodeComponent);
            break;
        case 'login-oauth-grant.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-oauth-grant'
            ).then(c => c.LoginOauthGrantComponent);
            break;
        case 'login-otp.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-otp'
            ).then(c => c.LoginOtpComponent);

            break;
        case 'login-update-profile.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-update-profile'
            ).then(c => c.LoginUpdateProfileComponent);
            break;
        case 'login-update-password.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-update-password'
            ).then(c => c.LoginUpdatePasswordComponent);
            break;
        case 'login-idp-link-confirm.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-idp-link-confirm'
            ).then(c => c.LoginIdpLinkConfirmComponent);
            break;
        case 'login-idp-link-email.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-idp-link-email'
            ).then(c => c.LoginIdpLinkEmailComponent);
            break;
        case 'login-page-expired.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-page-expired'
            ).then(c => c.LoginPageExpiredComponent);
            break;
        case 'login-config-totp.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-config-totp'
            ).then(c => c.LoginConfigTotpComponent);
            break;
        case 'logout-confirm.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/logout-confirm'
            ).then(c => c.LogoutConfirmComponent);
            break;
        case 'idp-review-user-profile.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/idp-review-user-profile'
            ).then(c => c.IdpReviewUserProfileComponent);
            break;
        case 'update-email.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/update-email'
            ).then(c => c.UpdateEmailComponent);
            break;
        case 'select-authenticator.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/select-authenticator'
            ).then(c => c.SelectAuthenticatorComponent);
            break;
        case 'saml-post-form.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/saml-post-form'
            ).then(c => c.SamlPostFormComponent);
            break;
        case 'delete-credential.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/delete-credential'
            ).then(c => c.DeleteCredentialComponent);
            break;
        case 'code.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/code'
            ).then(c => c.CodeComponent);
            break;
        case 'delete-account-confirm.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/delete-account-confirm'
            ).then(c => c.DeleteAccountConfirmComponent);
            break;
        case 'frontchannel-logout.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/frontchannel-logout'
            ).then(c => c.FrontchannelLogoutComponent);
            break;
        case 'login-recovery-authn-code-config.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-recovery-authn-code-config'
            ).then(c => c.LoginRecoveryAuthnCodeConfigComponent);
            break;
        case 'login-recovery-authn-code-input.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-recovery-authn-code-input'
            ).then(c => c.LoginRecoveryAuthnCodeInputComponent);
            break;
        case 'login-reset-otp.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-reset-otp'
            ).then(c => c.LoginResetOtpComponent);
            break;
        case 'login-x509-info.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-x509-info'
            ).then(c => c.LoginX509InfoComponent);
            break;
        case 'webauthn-error.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/webauthn-error'
            ).then(c => c.WebauthnErrorComponent);
            break;
        case 'login-passkeys-conditional-authenticate.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-passkeys-conditional-authenticate'
            ).then(c => c.LoginPasskeysConditionalAuthenticateComponent);
            break;
        case 'login-idp-link-confirm-override.ftl':
            ComponentBootstrapPromise = import(
                '@keycloakify/angular/login/pages/login-idp-link-confirm-override'
            ).then(c => c.LoginIdpLinkConfirmOverrideComponent);
            break;
    }
    return ComponentBootstrapPromise?.then(ComponentBootstrap => ({
        ComponentBootstrap,
        doMakeUserConfirmPassword,
        doUseDefaultCss,
        classes
    }));
};

export { DefaultPage };

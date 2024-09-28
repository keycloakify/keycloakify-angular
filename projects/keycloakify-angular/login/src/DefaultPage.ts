import { Type } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';

const DefaultPage = async (
  pageId: KcContext['pageId'],
  doMakeUserConfirmPassword = true,
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
    case 'login.ftl':
      ComponentBootstrapPromise = import('./pages/login/login.component').then((c) => c.LoginComponent);
      break;
    case 'login-username.ftl':
      ComponentBootstrapPromise = import('./pages/login-username/login-username.component').then(
        (c) => c.LoginUsernameComponent,
      );
      break;
    case 'login-password.ftl':
      ComponentBootstrapPromise = import('./pages/login-password/login-password.component').then(
        (c) => c.LoginPasswordComponent,
      );
      break;
    case 'webauthn-authenticate.ftl':
      ComponentBootstrapPromise = import('./pages/webauthn-authenticate/webauthn-authenticate.component').then(
        (c) => c.WebauthnAuthenticateComponent,
      );
      break;
    case 'webauthn-register.ftl':
      ComponentBootstrapPromise = import('./pages/webauthn-register/webauthn-register.component').then(
        (c) => c.WebauthnRegisterComponent,
      );
      break;
    case 'register.ftl':
      ComponentBootstrapPromise = import('./pages/register/register.component').then((c) => c.RegisterComponent);
      break;
    case 'info.ftl':
      ComponentBootstrapPromise = import('./pages/info/info.component').then((c) => c.InfoComponent);
      break;
    case 'error.ftl':
      ComponentBootstrapPromise = import('./pages/error/error.component').then((c) => c.ErrorComponent);
      break;
    case 'login-reset-password.ftl':
      ComponentBootstrapPromise = import('./pages/login-reset-password/login-reset-password.component').then(
        (c) => c.LoginResetPasswordComponent,
      );
      break;
    case 'login-verify-email.ftl':
      ComponentBootstrapPromise = import('./pages/login-verify-email/login-verify-email.component').then(
        (c) => c.LoginVerifyEmailComponent,
      );
      break;
    case 'terms.ftl':
      ComponentBootstrapPromise = import('./pages/terms/terms.component').then((c) => c.TermsComponent);
      break;
    case 'login-oauth2-device-verify-user-code.ftl':
      ComponentBootstrapPromise = import(
        './pages/login-oauth2-device-verify-user-code/login-oauth2-device-verify-user-code.component'
      ).then((c) => c.LoginOauth2DeviceVerifyUserCodeComponent);
      break;
    case 'login-oauth-grant.ftl':
      ComponentBootstrapPromise = import('./pages/login-oauth-grant/login-oauth-grant.component').then(
        (c) => c.LoginOauthGrantComponent,
      );
      break;
    case 'login-otp.ftl':
      ComponentBootstrapPromise = import('./pages/login-otp/login-otp.component').then((c) => c.LoginOtpComponent);

      break;
    case 'login-update-profile.ftl':
      ComponentBootstrapPromise = import('./pages/login-update-profile/login-update-profile.component').then(
        (c) => c.LoginUpdateProfileComponent,
      );
      break;
    case 'login-update-password.ftl':
      ComponentBootstrapPromise = import('./pages/login-update-password/login-update-password.component').then(
        (c) => c.LoginUpdatePasswordComponent,
      );
      break;
    case 'login-idp-link-confirm.ftl':
      ComponentBootstrapPromise = import('./pages/login-idp-link-confirm/login-idp-link-confirm.component').then(
        (c) => c.LoginIdpLinkConfirmComponent,
      );
      break;
    case 'login-idp-link-email.ftl':
      ComponentBootstrapPromise = import('./pages/login-idp-link-email/login-idp-link-email.component').then(
        (c) => c.LoginIdpLinkEmailComponent,
      );
      break;
    case 'login-page-expired.ftl':
      ComponentBootstrapPromise = import('./pages/login-page-expired/login-page-expired.component').then(
        (c) => c.LoginPageExpiredComponent,
      );
      break;
    case 'login-config-totp.ftl':
      ComponentBootstrapPromise = import('./pages/login-config-totp/login-config-totp.component').then(
        (c) => c.LoginConfigTotpComponent,
      );
      break;
    case 'logout-confirm.ftl':
      ComponentBootstrapPromise = import('./pages/logout-confirm/logout-confirm.component').then(
        (c) => c.LogoutConfirmComponent,
      );
      break;
    case 'idp-review-user-profile.ftl':
      ComponentBootstrapPromise = import('./pages/idp-review-user-profile/idp-review-user-profile.component').then(
        (c) => c.IdpReviewUserProfileComponent,
      );
      break;
    case 'update-email.ftl':
      ComponentBootstrapPromise = import('./pages/update-email/update-email.component').then(
        (c) => c.UpdateEmailComponent,
      );
      break;
    case 'select-authenticator.ftl':
      ComponentBootstrapPromise = import('./pages/select-authenticator/select-authenticator.component').then(
        (c) => c.SelectAuthenticatorComponent,
      );
      break;
    case 'saml-post-form.ftl':
      ComponentBootstrapPromise = import('./pages/saml-post-form/saml-post-form.component').then(
        (c) => c.SamlPostFormComponent,
      );
      break;
    case 'delete-credential.ftl':
      ComponentBootstrapPromise = import('./pages/delete-credential/delete-credential.component').then(
        (c) => c.DeleteCredentialComponent,
      );
      break;
    case 'code.ftl':
      ComponentBootstrapPromise = import('./pages/code/code.component').then((c) => c.CodeComponent);
      break;
    case 'delete-account-confirm.ftl':
      ComponentBootstrapPromise = import('./pages/delete-account-confirm/delete-account-confirm.component').then(
        (c) => c.DeleteAccountConfirmComponent,
      );
      break;
    case 'frontchannel-logout.ftl':
      ComponentBootstrapPromise = import('./pages/frontchannel-logout/frontchannel-logout.component').then(
        (c) => c.FrontchannelLogoutComponent,
      );
      break;
    case 'login-recovery-authn-code-config.ftl':
      ComponentBootstrapPromise = import(
        './pages/login-recovery-authn-code-config/login-recovery-authn-code-config.component'
      ).then((c) => c.LoginRecoveryAuthnCodeConfigComponent);
      break;
    case 'login-recovery-authn-code-input.ftl':
      ComponentBootstrapPromise = import(
        './pages/login-recovery-authn-code-input/login-recovery-authn-code-input.component'
      ).then((c) => c.LoginRecoveryAuthnCodeInputComponent);
      break;
    case 'login-reset-otp.ftl':
      ComponentBootstrapPromise = import('./pages/login-reset-otp/login-reset-otp.component').then(
        (c) => c.LoginResetOtpComponent,
      );
      break;
    case 'login-x509-info.ftl':
      ComponentBootstrapPromise = import('./pages/login-x509-info/login-x509-info.component').then(
        (c) => c.LoginX509InfoComponent,
      );
      break;
    case 'webauthn-error.ftl':
      ComponentBootstrapPromise = import('./pages/webauthn-error/webauthn-error.component').then(
        (c) => c.WebauthnErrorComponent,
      );
      break;
    case 'login-passkeys-conditional-authenticate.ftl':
      ComponentBootstrapPromise = import(
        './pages/login-passkeys-conditional-authenticate/login-passkeys-conditional-authenticate.component'
      ).then((c) => c.LoginPasskeysConditionalAuthenticateComponent);
      break;
    case 'login-idp-link-confirm-override.ftl':
      ComponentBootstrapPromise = import(
        './pages/login-idp-link-confirm-override/login-idp-link-confirm-override.component'
      ).then((c) => c.LoginIdpLinkConfirmOverrideComponent);
      break;
  }
  return ComponentBootstrapPromise?.then((ComponentBootstrap) => ({
    ComponentBootstrap,
    doMakeUserConfirmPassword,
    doUseDefaultCss,
    classes,
  }));
};

export { DefaultPage };

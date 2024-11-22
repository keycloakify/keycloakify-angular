import { ChangeDetectionStrategy, Component, forwardRef, inject, type TemplateRef, viewChild } from '@angular/core';
import { type Script } from '@keycloakify/angular/lib/models/script';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    imports: [KcClassDirective, LogoutOtherSessionsComponent],
    selector: 'kc-webauthn-register',
    templateUrl: 'webauthn-register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => WebauthnRegisterComponent)
        }
    ]
})
export class WebauthnRegisterComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'webauthn-register.ftl' }>>(KC_LOGIN_CONTEXT);
    loginResourceInjectorService = inject(LoginResourceInjectorService);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage = true;

    headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

    authButtonId = 'authenticateWebAuthnButton';

    constructor() {
        super();
        const {
            url,
            challenge,
            userid,
            username,
            signatureAlgorithms,
            rpEntityName,
            rpId,
            attestationConveyancePreference,
            authenticatorAttachment,
            requireResidentKey,
            userVerificationRequirement,
            createTimeout,
            excludeCredentialIds
        } = this.kcContext;
        const scripts: Script[] = [
            {
                type: 'module',
                id: 'WebAuthnRegisterScript',
                textContent: `
              import { registerByWebAuthn } from "${url.resourcesPath}/js/webauthnRegister.js";
              const registerButton = document.getElementById('${this.authButtonId}');
              registerButton.addEventListener("click", function() {
                  const input = {
                      challenge : '${challenge}',
                      userid : '${userid}',
                      username : '${username}',
                      signatureAlgorithms : ${JSON.stringify(signatureAlgorithms)},
                      rpEntityName : ${JSON.stringify(rpEntityName)},
                      rpId : ${JSON.stringify(rpId)},
                      attestationConveyancePreference : ${JSON.stringify(attestationConveyancePreference)},
                      authenticatorAttachment : ${JSON.stringify(authenticatorAttachment)},
                      requireResidentKey : ${JSON.stringify(requireResidentKey)},
                      userVerificationRequirement : ${JSON.stringify(userVerificationRequirement)},
                      createTimeout : ${createTimeout},
                      excludeCredentialIds : ${JSON.stringify(excludeCredentialIds)},
                      initLabel : ${JSON.stringify(this.i18n.msgStr('webauthn-registration-init-label'))},
                      initLabelPrompt : ${JSON.stringify(this.i18n.msgStr('webauthn-registration-init-label-prompt'))},
                      errmsg : ${JSON.stringify(this.i18n.msgStr('webauthn-unsupported-browser-text'))}
                  };
                  registerByWebAuthn(input);
              });
          `
            }
        ];
        this.loginResourceInjectorService.insertAdditionalScripts(scripts);
    }
}

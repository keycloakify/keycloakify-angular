import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { LogoutOtherSessionsComponent } from '../../components/logout-other-sessions/logout-other-sessions.component';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';
import { ResourceInjectorService } from '../../services';
import { Script } from '../../models/script.model';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, KcClassDirective, LogoutOtherSessionsComponent],
  selector: 'kc-root',
  templateUrl: 'webauthn-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MsgStrPipe,
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => WebauthnRegisterComponent),
    },
  ],
})
export class WebauthnRegisterComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'webauthn-register.ftl' }>>(KC_CONTEXT);
  resourceInjectorService = inject(ResourceInjectorService);
  msgStr = inject(MsgStrPipe);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = true;

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
      excludeCredentialIds,
    } = this.kcContext;
    const scripts: Script[] = [
      {
        type: 'module',
        id: 'WebAuthnScript',
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
                      initLabel : ${JSON.stringify(this.msgStr.transform('webauthn-registration-init-label'))},
                      initLabelPrompt : ${JSON.stringify(this.msgStr.transform('webauthn-registration-init-label-prompt'))},
                      errmsg : ${JSON.stringify(this.msgStr.transform('webauthn-unsupported-browser-text'))}
                  };
                  registerByWebAuthn(input);
              });
          `,
      },
    ];
    this.resourceInjectorService.insertAdditionalScripts(scripts);
  }
}

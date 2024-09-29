import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input
} from "@angular/core";
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/public-api";
import { Script } from "@keycloakify/angular/lib/models";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { LogoutOtherSessionsComponent } from "@keycloakify/angular/login/components/logout-other-sessions/logout-other-sessions.component";
import { TemplateComponent } from "@keycloakify/angular/login/containers/template.component";
import { KcClassDirective } from "@keycloakify/angular/login/directives";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";
import { LoginResourceInjectorService } from "@keycloakify/angular/login/services";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        KcClassDirective,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "webauthn-register.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        MsgStrPipe,
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => WebauthnRegisterComponent)
        }
    ]
})
export class WebauthnRegisterComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "webauthn-register.ftl" }>>(KC_CONTEXT);
    loginResourceInjectorService = inject(LoginResourceInjectorService);
    msgStr = inject(MsgStrPipe);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = true;

    authButtonId = "authenticateWebAuthnButton";

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
                type: "module",
                id: "WebAuthnRegisterScript",
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
                      initLabel : ${JSON.stringify(this.msgStr.transform("webauthn-registration-init-label"))},
                      initLabelPrompt : ${JSON.stringify(this.msgStr.transform("webauthn-registration-init-label-prompt"))},
                      errmsg : ${JSON.stringify(this.msgStr.transform("webauthn-unsupported-browser-text"))}
                  };
                  registerByWebAuthn(input);
              });
          `
            }
        ];
        this.loginResourceInjectorService.insertAdditionalScripts(scripts);
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input
} from "@angular/core";
import { CLASSES, KC_CONTEXT, Script, USE_DEFAULT_CSS } from "keycloakify-angular";
import { ClassKey } from "keycloakify/login";
import { KcContext } from "keycloakify/login/KcContext";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { ComponentReference } from "../../classes/component-reference.class";
import { LogoutOtherSessionsComponent } from "../../components/logout-other-sessions/logout-other-sessions.component";
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives";
import { AdvancedMsgStrPipe } from "../../pipes/advanced-msg-str.pipe";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";
import { LoginResourceInjectorService } from "../../services";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        AdvancedMsgStrPipe,
        KcClassDirective,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "webauthn-authenticate.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        MsgStrPipe,
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => WebauthnAuthenticateComponent)
        }
    ]
})
export class WebauthnAuthenticateComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>>(KC_CONTEXT);
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
            isUserIdentified,
            challenge,
            userVerification,
            rpId,
            createTimeout
        } = this.kcContext;
        const scripts: Script[] = [
            {
                type: "module",
                id: "WebAuthnAuthenticateScript",
                textContent: `
              import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
              const authButton = document.getElementById('${this.authButtonId}');
              authButton.addEventListener("click", function() {
                  const input = {
                      isUserIdentified : ${isUserIdentified},
                      challenge : '${challenge}',
                      userVerification : '${userVerification}',
                      rpId : '${rpId}',
                      createTimeout : ${createTimeout},
                      errmsg : ${JSON.stringify(this.msgStr.transform("webauthn-unsupported-browser-text"))}
                  };
                  authenticateByWebAuthn(input);
              });
          `
            }
        ];
        this.loginResourceInjectorService.insertAdditionalScripts(scripts);
    }

    selectAuthListItemIconClass(iconClass: string) {
        const kcClsx = getKcClsx({
            doUseDefaultCss: this.doUseDefaultCss ?? true,
            classes: this.classes
        }).kcClsx;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const className = kcClsx(iconClass as any);
        if (className === iconClass) {
            return kcClsx("kcWebAuthnDefaultIcon");
        }
        return className;
    }
}

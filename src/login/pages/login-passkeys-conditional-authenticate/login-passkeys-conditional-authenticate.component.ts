import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from '@keycloakify/angular/lib/public-api';
import { Script } from '@keycloakify/angular/lib/models';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { AdvancedMsgStrPipe } from '@keycloakify/angular/login/pipes/advanced-msg-str.pipe';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services';

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe, KcClassDirective, AdvancedMsgStrPipe],
    selector: 'kc-root',
    templateUrl: 'login-passkeys-conditional-authenticate.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        MsgStrPipe,
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginPasskeysConditionalAuthenticateComponent)
        }
    ]
})
export class LoginPasskeysConditionalAuthenticateComponent extends ComponentReference {
    kcContext =
        inject<
            Extract<KcContext, { pageId: 'login-passkeys-conditional-authenticate.ftl' }>
        >(KC_CONTEXT);
    loginResourceInjectorService = inject(LoginResourceInjectorService);
    msgStr = inject(MsgStrPipe);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayInfo: boolean = true;

    authButtonId = 'authenticateWebAuthnButton';

    constructor() {
        super();
        const {
            url,
            challenge,
            rpId,
            userVerification,
            isUserIdentified,

            createTimeout
        } = this.kcContext;
        const scripts: Script[] = [
            {
                type: 'module',
                id: 'LoginRecoveryAuthnCodeConfig',
                textContent: `
                    import { authenticateByWebAuthn } from "${url.resourcesPath}/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${url.resourcesPath}/js/passkeysConditionalAuth.js";

                    const authButton = document.getElementById("${this.authButtonId}");
                    const input = {
                        isUserIdentified : ${isUserIdentified},
                        challenge : ${JSON.stringify(challenge)},
                        userVerification : ${JSON.stringify(userVerification)},
                        rpId : ${JSON.stringify(rpId)},
                        createTimeout : ${createTimeout}
                    };
                    authButton.addEventListener("click", () => {
                        authenticateByWebAuthn({
                            ...input,
                            errmsg : ${JSON.stringify(this.msgStr.transform('webauthn-unsupported-browser-text'))}
                        });
                    });

                    initAuthenticate({
                        ...input,
                        errmsg : ${JSON.stringify(this.msgStr.transform('passkey-unsupported-browser-text'))}
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
            return kcClsx('kcWebAuthnDefaultIcon');
        }
        return className;
    }
}

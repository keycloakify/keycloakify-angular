import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { Script } from '@keycloakify/angular/lib/models/script.model';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector.service';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { I18n } from '../../i18n';
import { KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective],
    selector: 'kc-root',
    templateUrl: 'login-passkeys-conditional-authenticate.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginPasskeysConditionalAuthenticateComponent)
        }
    ]
})
export class LoginPasskeysConditionalAuthenticateComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-passkeys-conditional-authenticate.ftl' }>>(KC_LOGIN_CONTEXT);
    loginResourceInjectorService = inject(LoginResourceInjectorService);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
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
                            errmsg : ${JSON.stringify(this.i18n.msgStr('webauthn-unsupported-browser-text'))}
                        });
                    });

                    initAuthenticate({
                        ...input,
                        errmsg : ${JSON.stringify(this.i18n.msgStr('passkey-unsupported-browser-text'))}
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

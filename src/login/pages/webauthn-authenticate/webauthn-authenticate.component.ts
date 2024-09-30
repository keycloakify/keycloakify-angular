import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { Script } from '@keycloakify/angular/lib/models/script.model';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions/logout-other-sessions.component';
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
    imports: [TemplateComponent, KcClassDirective, LogoutOtherSessionsComponent],
    selector: 'kc-root',
    templateUrl: 'webauthn-authenticate.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => WebauthnAuthenticateComponent)
        }
    ]
})
export class WebauthnAuthenticateComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>>(KC_LOGIN_CONTEXT);
    loginResourceInjectorService = inject(LoginResourceInjectorService);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = true;

    authButtonId = 'authenticateWebAuthnButton';

    constructor() {
        super();
        const { url, isUserIdentified, challenge, userVerification, rpId, createTimeout } = this.kcContext;
        const scripts: Script[] = [
            {
                type: 'module',
                id: 'WebAuthnAuthenticateScript',
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
                      errmsg : ${JSON.stringify(this.i18n.msgStr('webauthn-unsupported-browser-text'))}
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
            return kcClsx('kcWebAuthnDefaultIcon');
        }
        return className;
    }
}

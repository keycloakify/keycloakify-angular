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
import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';

@Component({
    imports: [KcClassDirective, LogoutOtherSessionsComponent],
    selector: 'kc-webauthn-authenticate',
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

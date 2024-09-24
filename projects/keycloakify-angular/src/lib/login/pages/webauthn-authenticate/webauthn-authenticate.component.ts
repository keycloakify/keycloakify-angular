import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';
import { LogoutOtherSessionsComponent } from '../../components/logout-other-sessions/logout-other-sessions.component';
import { TemplateComponent } from '../../containers/template.component';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { AdvancedMsgStrPipe } from '../../pipes/advanced-msg-str.pipe';
import { ResourceInjectorService } from '../../services';
import { Script } from '../../models/script.model';
import { KcClassDirective } from '../../directives';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, AdvancedMsgStrPipe, KcClassDirective, LogoutOtherSessionsComponent],
  selector: 'kc-root',
  templateUrl: 'webauthn-authenticate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MsgStrPipe,
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => WebauthnAuthenticateComponent),
    },
  ],
})
export class WebauthnAuthenticateComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'webauthn-authenticate.ftl' }>>(KC_CONTEXT);
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
                      errmsg : ${JSON.stringify(this.msgStr.transform('webauthn-unsupported-browser-text'))}
                  };
                  authenticateByWebAuthn(input);
              });
          `,
      },
    ];
    this.resourceInjectorService.insertAdditionalScripts(scripts);
  }

  selectAuthListItemIconClass(iconClass: string) {
    const kcClsx = getKcClsx({ doUseDefaultCss: this.doUseDefaultCss() ?? true, classes: this.classes() }).kcClsx;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const className = kcClsx(iconClass as any);
    if (className === iconClass) {
      return kcClsx('kcWebAuthnDefaultIcon');
    }
    return className;
  }
}

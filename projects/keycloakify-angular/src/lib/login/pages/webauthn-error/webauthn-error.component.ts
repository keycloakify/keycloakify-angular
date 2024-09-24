import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';
import { LogoutOtherSessionsComponent } from '../../components/logout-other-sessions/logout-other-sessions.component';
import { TemplateComponent } from '../../containers/template.component';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';
import { KcClassDirective } from '../../directives';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, KcClassDirective, LogoutOtherSessionsComponent],
  selector: 'kc-root',
  templateUrl: 'webauthn-error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => WebauthnErrorComponent),
    },
  ],
})
export class WebauthnErrorComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'webauthn-error.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = true;

  onClick() {
    // @ts-expect-error: Trusted Keycloak's code
    document.getElementById('isSetRetry').value = 'retry';
    // @ts-expect-error: Trusted Keycloak's code
    document.getElementById('executionValue').value = '${execution}';
    // @ts-expect-error: Trusted Keycloak's code
    document.getElementById('kc-error-credential-form').submit();
  }
}

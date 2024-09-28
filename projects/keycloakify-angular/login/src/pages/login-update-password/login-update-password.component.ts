import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { LogoutOtherSessionsComponent } from '../../components/logout-other-sessions/logout-other-sessions.component';
import { PasswordWrapperComponent } from '../../components/password-wrapper/password-wrapper.component';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { KcSanitizePipe } from '../../pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [
    TemplateComponent,
    MsgStrPipe,
    KcClassDirective,
    PasswordWrapperComponent,
    KcSanitizePipe,
    LogoutOtherSessionsComponent,
  ],
  selector: 'kc-root',
  templateUrl: 'login-update-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginUpdatePasswordComponent),
    },
  ],
})
export class LoginUpdatePasswordComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-update-password.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo = false;
  displayMessage = !this.kcContext.messagesPerField.existsError('password', 'password-confirm');
}

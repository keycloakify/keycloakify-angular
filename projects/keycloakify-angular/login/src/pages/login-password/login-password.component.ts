import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { PasswordWrapperComponent } from '../../components/password-wrapper/password-wrapper.component';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { KcSanitizePipe } from '../../pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, KcClassDirective, PasswordWrapperComponent, KcSanitizePipe],
  selector: 'kc-root',
  templateUrl: 'login-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginPasswordComponent),
    },
  ],
})
export class LoginPasswordComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-password.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo = false;
  displayMessage = this.kcContext.messagesPerField.existsError('password');

  isLoginButtonDisabled = signal(false);
}

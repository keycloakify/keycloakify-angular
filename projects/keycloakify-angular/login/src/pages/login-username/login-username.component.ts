import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { KcSanitizePipe } from '../../pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  selector: 'kc-root',
  templateUrl: './login-username.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KcClassDirective, AsyncPipe, KcSanitizePipe, NgClass, TemplateComponent, MsgStrPipe],
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginUsernameComponent),
    },
  ],
})
export class LoginUsernameComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-username.ftl' }>>(KC_CONTEXT);
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
  isLoginButtonDisabled = signal(false);
  displayInfo: boolean =
    !!this.kcContext?.realm?.password &&
    !!this.kcContext?.realm?.registrationAllowed &&
    !this.kcContext?.registrationDisabled;
  displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('username');
}

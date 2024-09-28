import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [KcClassDirective, MsgStrPipe, TemplateComponent],
  selector: 'kc-root',
  templateUrl: 'login-reset-otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginResetOtpComponent),
    },
  ],
})
export class LoginResetOtpComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-reset-otp.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = this.kcContext.messagesPerField.existsError('totp');
}

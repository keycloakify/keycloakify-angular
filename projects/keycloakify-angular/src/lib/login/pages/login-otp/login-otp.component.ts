import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { KcSanitizePipe } from 'keycloakify-angular/public-api';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';

@Component({
  standalone: true,
  imports: [TemplateComponent, KcClassDirective, MsgStrPipe, KcSanitizePipe],
  selector: 'kc-root',
  templateUrl: 'login-otp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginOtpComponent),
    },
  ],
})
export class LoginOtpComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-otp.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = this.kcContext.messagesPerField.existsError('totp');
}

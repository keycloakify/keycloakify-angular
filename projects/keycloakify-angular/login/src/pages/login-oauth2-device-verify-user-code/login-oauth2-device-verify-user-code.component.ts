import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, KcClassDirective],
  selector: 'kc-root',
  templateUrl: 'login-oauth2-device-verify-user-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ComponentReference, useExisting: forwardRef(() => LoginOauth2DeviceVerifyUserCodeComponent) }],
})
export class LoginOauth2DeviceVerifyUserCodeComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = false;
}
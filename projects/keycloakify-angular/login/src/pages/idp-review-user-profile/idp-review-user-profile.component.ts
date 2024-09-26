import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { UserProfileFormFieldsComponent } from '../../components/user-profile-form-fields/user-profile-form-fields.component';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, UserProfileFormFieldsComponent, KcClassDirective],
  selector: 'kc-root',
  templateUrl: 'idp-review-user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => IdpReviewUserProfileComponent),
    },
  ],
})
export class IdpReviewUserProfileComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>>(KC_CONTEXT);
  displayRequiredFields = input(true);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  isFormSubmittable = signal(false);
  displayInfo: boolean = false;
  displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('global');

  onCallback() {
    (document.getElementById('kc-register-form') as HTMLFormElement).submit();
  }
}

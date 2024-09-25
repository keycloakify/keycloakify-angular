import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  effect,
  forwardRef,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { AdvancedMsgStrPipe } from '../../pipes/advanced-msg-str.pipe';
import { DO_MAKE_USER_CONFIRM_PASSWORD, KC_CONTEXT } from '../../providers/keycloakify-angular.providers';
import { FormAction, UserProfileFormService } from '../../services/user-profile-form.service';
import { FieldErrorsComponent } from '../field-errors/field-errors.component';
import { GroupLabelComponent } from '../group-label/group-label.component';
import { InputFieldByTypeComponent } from '../input-field-by-type/input-field-by-type.component';

@Component({
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [
    KcClassDirective,
    FieldErrorsComponent,
    InputFieldByTypeComponent,
    GroupLabelComponent,
    NgTemplateOutlet,
    AdvancedMsgStrPipe,
  ],
  selector: 'kc-user-profile-form-fields',
  templateUrl: 'user-profile-form-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserProfileFormService,
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => UserProfileFormFieldsComponent),
    },
  ],
})
export class UserProfileFormFieldsComponent extends ComponentReference {
  kcContext = inject<KcContext>(KC_CONTEXT);
  userProfileFormService = inject(UserProfileFormService);
  doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();

  onIsFormSubmittable = output<boolean>();

  formState = this.userProfileFormService.formState;

  @ContentChild('beforField') beforeField: TemplateRef<unknown> | undefined;
  @ContentChild('afterField') afterField: TemplateRef<unknown> | undefined;

  constructor() {
    super();
    effect(() => {
      const isFormSubmittable = this.formState().isFormSubmittable;
      this.onIsFormSubmittable.emit(isFormSubmittable);
    });
  }

  onDispatch(formAction: FormAction) {
    this.userProfileFormService.dispatchFormAction(formAction);
  }
}

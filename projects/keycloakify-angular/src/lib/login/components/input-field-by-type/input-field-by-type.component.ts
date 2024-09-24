import { ChangeDetectionStrategy, Component, forwardRef, input, output } from '@angular/core';
import { Attribute, ClassKey } from 'keycloakify/login';
import { ToArrayPipe } from '../../pipes/to-array.pipe';
import { FormAction, FormFieldError } from '../../services/user-profile-form.service';
import { InputTagSelectsComponent } from '../input-tag-selects/input-tag-selects.component';
import { InputTagComponent } from '../input-tag/input-tag.component';
import { PasswordWrapperComponent } from '../password-wrapper/password-wrapper.component';
import { SelectTagComponent } from '../select-tag/select-tag.component';
import { TextareaTagComponent } from '../textarea-tag/textarea-tag.component';
import { ComponentReference } from '../../classes/component-reference.class';

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
    ToArrayPipe,
    TextareaTagComponent,
    SelectTagComponent,
    InputTagSelectsComponent,
    InputTagComponent,
    PasswordWrapperComponent,
  ],
  selector: 'kc-input-field-by-type',
  templateUrl: 'input-field-by-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ComponentReference, useExisting: forwardRef(() => InputFieldByTypeComponent) }],
})
export class InputFieldByTypeComponent extends ComponentReference {
  attribute = input<Attribute>();
  valueOrValues = input<string | string[]>();
  displayableErrors = input<FormFieldError[]>();
  dispatchFormAction = output<FormAction>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}

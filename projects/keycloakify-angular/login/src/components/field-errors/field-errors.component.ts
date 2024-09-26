import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { Attribute, ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { FormFieldError } from '../../services/user-profile-form.service';

@Component({
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [KcClassDirective],
  selector: 'kc-field-errors',
  templateUrl: 'field-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ComponentReference, useExisting: forwardRef(() => FieldErrorsComponent) }],
})
export class FieldErrorsComponent extends ComponentReference {
  attribute = input<Attribute>();
  displayableErrors = input<FormFieldError[]>();
  fieldIndex = input<number>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}

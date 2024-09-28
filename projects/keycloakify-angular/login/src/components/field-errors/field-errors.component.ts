import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { CLASSES, USE_DEFAULT_CSS } from 'keycloakify-angular';
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
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

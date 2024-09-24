import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output } from '@angular/core';
import { Attribute, ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { AttributesDirective } from '../../directives/attributes.directive';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { InputTypePipe } from '../../pipes/input-type.pipe';
import { KcTranslatePipe } from '../../pipes/kcTranslate.pipe';
import { ToArrayPipe } from '../../pipes/to-array.pipe';
import { ToNumberPipe } from '../../pipes/to-number.pipe';
import { FormAction, FormFieldError } from '../../services/user-profile-form.service';
import { AddRemoveButtonsMultiValuedAttributeComponent } from '../add-remove-buttons-multi-valued-attribute/add-remove-buttons-multi-valued-attribute.component';
import { FieldErrorsComponent } from '../field-errors/field-errors.component';

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
    InputTypePipe,
    KcClassDirective,
    KcTranslatePipe,
    ToNumberPipe,
    AttributesDirective,
    ToArrayPipe,
    FieldErrorsComponent,
    AddRemoveButtonsMultiValuedAttributeComponent,
  ],
  selector: 'kc-input-tag',
  templateUrl: 'input-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => InputTagComponent),
    },
  ],
})
export class InputTagComponent extends ComponentReference {
  attribute = input<Attribute>();
  valueOrValues = input<string | string[]>();
  fieldIndex = input<number | undefined>(undefined);
  values = input<string[]>();
  displayableErrors = input<FormFieldError[]>();
  dispatchFormAction = output<FormAction>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();

  value = computed(() => {
    const valueOrValues = this.valueOrValues();
    const index = this.fieldIndex();
    if (valueOrValues instanceof Array) {
      if (index) {
        return valueOrValues[index] ?? null;
      }
      return null;
    }
    return valueOrValues?.[0] ?? null;
  });

  onChange(event: Event) {
    const valueOrValues = this.valueOrValues();
    this.dispatchFormAction.emit({
      action: 'update',
      name: this.attribute()?.name ?? '',
      valueOrValues: (() => {
        if (this.fieldIndex !== undefined) {
          if (valueOrValues instanceof Array) {
            return valueOrValues.map((value, i) => {
              if (i === this.fieldIndex()) {
                return (event.target as HTMLInputElement)?.value;
              }

              return value;
            });
          }
        }

        return (event.target as HTMLInputElement)?.value;
      })(),
    });
  }

  onBlur() {
    this.dispatchFormAction.emit({
      action: 'focus lost',
      name: this.attribute()?.name ?? '',
      fieldIndex: this.fieldIndex(),
    });
  }
}

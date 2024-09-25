import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output } from '@angular/core';
import { Attribute, ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { AdvancedMsgStrPipe } from '../../pipes/advanced-msg-str.pipe';
import { ToNumberPipe } from '../../pipes/to-number.pipe';
import { FormAction, FormFieldError } from '../../services/user-profile-form.service';

@Component({
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [KcClassDirective, ToNumberPipe, AdvancedMsgStrPipe],
  selector: 'kc-select-tag',
  templateUrl: 'select-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => SelectTagComponent),
    },
  ],
})
export class SelectTagComponent extends ComponentReference {
  attribute = input<Attribute>();
  valueOrValues = input<string | string[]>();
  displayableErrors = input<FormFieldError[]>();
  dispatchFormAction = output<FormAction>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();

  isMultiple = computed(() => {
    return this.attribute()?.annotations?.inputType === 'multiselect';
  });

  options = computed(() => {
    const attribute = this.attribute();
    if (attribute) {
      return (() => {
        walk: {
          const { inputOptionsFromValidation } = attribute.annotations;

          if (inputOptionsFromValidation === undefined) {
            break walk;
          }

          const validator = (attribute.validators as Record<string, { options?: string[] }>)[
            inputOptionsFromValidation
          ];

          if (validator === undefined) {
            break walk;
          }

          if (validator.options === undefined) {
            break walk;
          }

          return validator.options;
        }

        return attribute.validators.options?.options ?? [];
      })();
    }
    return [];
  });

  onChange(event: Event) {
    this.dispatchFormAction.emit({
      action: 'update',
      name: this.attribute()?.name ?? '',
      valueOrValues: (() => {
        if (this.isMultiple()) {
          return Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value);
        }

        return (event.target as HTMLSelectElement).value;
      })(),
    });
  }

  onBlur() {
    this.dispatchFormAction.emit({
      action: 'focus lost',
      name: this.attribute()?.name ?? '',
      fieldIndex: undefined,
    });
  }
}

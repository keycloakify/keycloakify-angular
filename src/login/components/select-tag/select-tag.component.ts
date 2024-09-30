import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { ToNumberPipe } from '@keycloakify/angular/login/pipes/to-number.pipe';
import { FormAction, FormFieldError } from '@keycloakify/angular/login/services/user-profile-form.service';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { Attribute } from 'keycloakify/login/KcContext';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { I18n } from '../../i18n';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective, ToNumberPipe],
    selector: 'kc-select-tag',
    templateUrl: 'select-tag.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => SelectTagComponent)
        }
    ]
})
export class SelectTagComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    attribute = input<Attribute>();
    valueOrValues = input<string | string[]>();
    displayableErrors = input<FormFieldError[]>();
    dispatchFormAction = output<FormAction>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

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

                    const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

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
                    return Array.from((event.target as HTMLSelectElement).selectedOptions).map(option => option.value);
                }

                return (event.target as HTMLSelectElement).value;
            })()
        });
    }

    onBlur() {
        this.dispatchFormAction.emit({
            action: 'focus lost',
            name: this.attribute()?.name ?? '',
            fieldIndex: undefined
        });
    }
}

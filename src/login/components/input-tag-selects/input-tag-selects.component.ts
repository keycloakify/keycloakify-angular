import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output, Signal } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { FormAction, FormFieldError } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import type { Attribute } from 'keycloakify/login/KcContext';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '@keycloakify/angular/login/i18n';

@Component({
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective],
    selector: 'kc-input-tag-selects',
    templateUrl: 'input-tag-selects.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => InputTagSelectsComponent)
        }
    ]
})
export class InputTagSelectsComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    attribute = input<Attribute>();
    valueOrValues = input<string | string[]>();
    dispatchFormAction = output<FormAction>();
    displayableErrors = input<FormFieldError[]>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    context: Signal<{
        inputType: 'radio' | 'checkbox';
        classDiv: ClassKey;
        classInput: ClassKey;
        classLabel: ClassKey;
    } | null> = computed(() => {
        const attribute = this.attribute();
        if (attribute) {
            const { inputType } = attribute.annotations;
            switch (inputType) {
                case 'select-radiobuttons':
                    return {
                        inputType: 'radio',
                        classDiv: 'kcInputClassRadio',
                        classInput: 'kcInputClassRadioInput',
                        classLabel: 'kcInputClassRadioLabel'
                    };
                case 'multiselect-checkboxes':
                    return {
                        inputType: 'checkbox',
                        classDiv: 'kcInputClassCheckbox',
                        classInput: 'kcInputClassCheckboxInput',
                        classLabel: 'kcInputClassCheckboxLabel'
                    };
            }
        }
        return null;
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

    checked(option: string) {
        const valueOrValues = this.valueOrValues();
        if (valueOrValues instanceof Array) {
            return valueOrValues.includes(option);
        }
        return valueOrValues === option;
    }

    onChange(event: Event, option: string) {
        const valueOrValues = this.valueOrValues();
        const isChecked = (event.target as HTMLInputElement).checked;
        this.dispatchFormAction.emit({
            action: 'update',
            name: this.attribute()?.name ?? '',
            valueOrValues: (() => {
                if (valueOrValues instanceof Array) {
                    const newValues = [...valueOrValues];

                    if (isChecked) {
                        newValues.push(option);
                    } else {
                        newValues.splice(newValues.indexOf(option), 1);
                    }

                    return newValues;
                }

                return (event.target as HTMLInputElement)?.checked ? option : '';
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

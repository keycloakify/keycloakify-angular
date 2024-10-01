import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, output } from '@angular/core';
import { AttributesDirective } from '@keycloakify/angular/lib/directives/attributes.directive';
import { InputTypePipe } from '@keycloakify/angular/lib/pipes/input-type.pipe';
import { ToArrayPipe } from '@keycloakify/angular/lib/pipes/to-array.pipe';
import { ToNumberPipe } from '@keycloakify/angular/lib/pipes/to-number.pipe';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { AddRemoveButtonsMultiValuedAttributeComponent } from '@keycloakify/angular/login/components/add-remove-buttons-multi-valued-attribute/add-remove-buttons-multi-valued-attribute.component';
import { FieldErrorsComponent } from '@keycloakify/angular/login/components/field-errors/field-errors.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { FormAction, FormFieldError } from '@keycloakify/angular/login/services/user-profile-form.service';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { type Attribute } from 'keycloakify/login/KcContext';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type I18n } from '../../i18n';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [
        InputTypePipe,
        KcClassDirective,
        ToNumberPipe,
        AttributesDirective,
        ToArrayPipe,
        FieldErrorsComponent,
        AddRemoveButtonsMultiValuedAttributeComponent
    ],
    selector: 'kc-input-tag',
    templateUrl: 'input-tag.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => InputTagComponent)
        }
    ]
})
export class InputTagComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    attribute = input<Attribute>();
    valueOrValues = input<string | string[]>();
    fieldIndex = input<number | undefined>(undefined);
    values = input<string[]>();
    displayableErrors = input<FormFieldError[]>();
    dispatchFormAction = output<FormAction>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    value = computed(() => {
        const valueOrValues = this.valueOrValues();
        const index = this.fieldIndex();
        if (valueOrValues instanceof Array) {
            if (index) {
                return valueOrValues[index] ?? null;
            }
            return null;
        }
        return valueOrValues ?? null;
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
            })()
        });
    }

    onBlur() {
        this.dispatchFormAction.emit({
            action: 'focus lost',
            name: this.attribute()?.name ?? '',
            fieldIndex: this.fieldIndex()
        });
    }
}

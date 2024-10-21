import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { getButtonToDisplayForMultivaluedAttributeField, type FormAction } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { type Attribute } from 'keycloakify/login/KcContext';
import type { I18n } from '@keycloakify/angular/login/i18n';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [],
    selector: 'kc-add-remove-buttons-multi-valued-attribute',
    templateUrl: 'add-remove-buttons-multi-valued-attribute.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRemoveButtonsMultiValuedAttributeComponent {
    i18n = inject<I18n>(LOGIN_I18N);
    attribute = input<Attribute>();
    values = input<string[]>();
    fieldIndex = input<number>();
    dispatchFormAction = output<FormAction>();

    hasRemove = computed(() => {
        const attribute = this.attribute();
        const values = this.values();
        const fieldIndex = this.fieldIndex();
        if (attribute && values && fieldIndex) {
            return getButtonToDisplayForMultivaluedAttributeField({
                attribute,
                values,
                fieldIndex
            }).hasRemove;
        }
        return false;
    });
    hasAdd = computed(() => {
        const attribute = this.attribute();
        const values = this.values();
        const fieldIndex = this.fieldIndex();
        if (attribute && values && fieldIndex) {
            return getButtonToDisplayForMultivaluedAttributeField({
                attribute,
                values,
                fieldIndex
            }).hasAdd;
        }
        return false;
    });

    onAdd() {
        this.dispatchFormAction.emit({
            action: 'update',
            name: this.attribute()?.name ?? '',
            valueOrValues: [...(this.values() ?? []), '']
        });
    }

    onRemove() {
        this.dispatchFormAction.emit({
            action: 'update',
            name: this.attribute()?.name ?? '',
            valueOrValues: (this.values() ?? []).filter((_, i) => i !== this.fieldIndex())
        });
    }
}

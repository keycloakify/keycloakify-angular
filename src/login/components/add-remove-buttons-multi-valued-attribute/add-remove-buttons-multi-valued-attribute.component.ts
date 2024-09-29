import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output
} from "@angular/core";
import { Attribute } from "keycloakify/login";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";
import { FormAction } from "../../services/user-profile-form.service";

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [MsgStrPipe],
    selector: "kc-add-remove-buttons-multi-valued-attribute",
    templateUrl: "add-remove-buttons-multi-valued-attribute.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRemoveButtonsMultiValuedAttributeComponent {
    attribute = input<Attribute>();
    values = input<string[]>();
    fieldIndex = input<number>();
    dispatchFormAction = output<FormAction>();

    hasRemove = computed(() => {
        const attribute = this.attribute();
        const values = this.values();
        const fieldIndex = this.fieldIndex();
        if (attribute && values && fieldIndex) {
            return this.getButtonToDisplayForMultivaluedAttributeField({
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
            return this.getButtonToDisplayForMultivaluedAttributeField({
                attribute,
                values,
                fieldIndex
            }).hasAdd;
        }
        return false;
    });

    onAdd() {
        this.dispatchFormAction.emit({
            action: "update",
            name: this.attribute()?.name ?? "",
            valueOrValues: [...(this.values() ?? []), ""]
        });
    }

    onRemove() {
        this.dispatchFormAction.emit({
            action: "update",
            name: this.attribute()?.name ?? "",
            valueOrValues: (this.values() ?? []).filter((_, i) => i !== this.fieldIndex())
        });
    }

    private getButtonToDisplayForMultivaluedAttributeField(params: {
        attribute: Attribute;
        values: string[];
        fieldIndex: number;
    }) {
        const { attribute, values, fieldIndex } = params;

        const hasRemove = (() => {
            if (values.length === 1) {
                return false;
            }

            const minCount = (() => {
                const { multivalued } = attribute.validators;

                if (multivalued === undefined) {
                    return undefined;
                }

                const minStr = multivalued.min;

                if (minStr === undefined) {
                    return undefined;
                }

                return parseInt(`${minStr}`);
            })();

            if (minCount === undefined) {
                return true;
            }

            if (values.length === minCount) {
                return false;
            }

            return true;
        })();

        const hasAdd = (() => {
            if (fieldIndex + 1 !== values.length) {
                return false;
            }

            const maxCount = (() => {
                const { multivalued } = attribute.validators;

                if (multivalued === undefined) {
                    return undefined;
                }

                const maxStr = multivalued.max;

                if (maxStr === undefined) {
                    return undefined;
                }

                return parseInt(`${maxStr}`);
            })();

            if (maxCount === undefined) {
                return true;
            }

            return values.length !== maxCount;
        })();

        return { hasRemove, hasAdd };
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    inject,
    input,
    output
} from "@angular/core";
import {
    CLASSES,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/providers/keycloakify-angular.providers";
import { Attribute } from "keycloakify/login/KcContext";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { AttributesDirective } from "@keycloakify/angular/login/directives/attributes.directive";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { AdvancedMsgStrPipe } from "@keycloakify/angular/login/pipes/advanced-msg-str.pipe";
import { InputTypePipe } from "@keycloakify/angular/login/pipes/input-type.pipe";
import { ToArrayPipe } from "@keycloakify/angular/login/pipes/to-array.pipe";
import { ToNumberPipe } from "@keycloakify/angular/login/pipes/to-number.pipe";
import {
    FormAction,
    FormFieldError
} from "@keycloakify/angular/login/services/user-profile-form.service";
import { AddRemoveButtonsMultiValuedAttributeComponent } from "../add-remove-buttons-multi-valued-attribute/add-remove-buttons-multi-valued-attribute.component";
import { FieldErrorsComponent } from "../field-errors/field-errors.component";

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
        AddRemoveButtonsMultiValuedAttributeComponent,
        AdvancedMsgStrPipe
    ],
    selector: "kc-input-tag",
    templateUrl: "input-tag.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => InputTagComponent)
        }
    ]
})
export class InputTagComponent extends ComponentReference {
    attribute = input<Attribute>();
    valueOrValues = input<string | string[]>();
    fieldIndex = input<number | undefined>(undefined);
    values = input<string[]>();
    displayableErrors = input<FormFieldError[]>();
    dispatchFormAction = output<FormAction>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);

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
            action: "update",
            name: this.attribute()?.name ?? "",
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
            action: "focus lost",
            name: this.attribute()?.name ?? "",
            fieldIndex: this.fieldIndex()
        });
    }
}
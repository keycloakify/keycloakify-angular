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
import { ToArrayPipe } from "@keycloakify/angular/login/pipes/to-array.pipe";
import {
    FormAction,
    FormFieldError
} from "@keycloakify/angular/login/services/user-profile-form.service";
import { InputTagSelectsComponent } from "../input-tag-selects/input-tag-selects.component";
import { InputTagComponent } from "../input-tag/input-tag.component";
import { PasswordWrapperComponent } from "../password-wrapper/password-wrapper.component";
import { SelectTagComponent } from "../select-tag/select-tag.component";
import { TextareaTagComponent } from "../textarea-tag/textarea-tag.component";

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
        ToArrayPipe,
        TextareaTagComponent,
        SelectTagComponent,
        InputTagSelectsComponent,
        InputTagComponent,
        PasswordWrapperComponent
    ],
    selector: "kc-input-field-by-type",
    templateUrl: "input-field-by-type.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => InputFieldByTypeComponent)
        }
    ]
})
export class InputFieldByTypeComponent extends ComponentReference {
    attribute = input<Attribute>();
    valueOrValues = input<string | string[]>();
    displayableErrors = input<FormFieldError[]>();
    dispatchFormAction = output<FormAction>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);

    attributePassword = computed<Attribute>(() => {
        const attribute: Attribute = this.attribute() ?? ({} as Attribute);
        return {
            ...attribute,
            annotations: { ...(attribute.annotations ?? {}), inputType: "password" }
        };
    });
}

import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    output
} from "@angular/core";
import { CLASSES, USE_DEFAULT_CSS } from "keycloakify-angular";
import { Attribute, ClassKey } from "keycloakify/login";
import { ComponentReference } from "../../classes/component-reference.class";
import { KcClassDirective } from "../../directives/kc-class.directive";
import { ToNumberPipe } from "../../pipes/to-number.pipe";
import { FormAction, FormFieldError } from "../../services/user-profile-form.service";

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
    selector: "kc-textarea-tag",
    templateUrl: "textarea-tag.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TextareaTagComponent)
        }
    ]
})
export class TextareaTagComponent extends ComponentReference {
    attribute = input<Attribute>();
    value = input<string>();
    displayableErrors = input<FormFieldError[]>();
    dispatchFormAction = output<FormAction>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);

    onChange(event: Event) {
        this.dispatchFormAction.emit({
            action: "update",
            name: this.attribute()?.name ?? "",
            valueOrValues: (event.target as HTMLTextAreaElement).value
        });
    }

    onBlur() {
        this.dispatchFormAction.emit({
            action: "focus lost",
            name: this.attribute()?.name ?? "",
            fieldIndex: undefined
        });
    }
}

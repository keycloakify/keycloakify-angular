import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    effect,
    forwardRef,
    inject,
    output,
    TemplateRef
} from "@angular/core";
import {
    DO_MAKE_USER_CONFIRM_PASSWORD,
    KC_CONTEXT,
    CLASSES,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/public-api";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { AdvancedMsgStrPipe } from "@keycloakify/angular/login/pipes/advanced-msg-str.pipe";
import {
    FormAction,
    UserProfileFormService
} from "@keycloakify/angular/login/services/user-profile-form.service";
import { FieldErrorsComponent } from "@keycloakify/angular/login/components/field-errors/field-errors.component";
import { GroupLabelComponent } from "@keycloakify/angular/login/components/group-label/group-label.component";
import { InputFieldByTypeComponent } from "@keycloakify/angular/login/components/input-field-by-type/input-field-by-type.component";

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
        KcClassDirective,
        FieldErrorsComponent,
        InputFieldByTypeComponent,
        GroupLabelComponent,
        NgTemplateOutlet,
        AdvancedMsgStrPipe
    ],
    selector: "kc-user-profile-form-fields",
    templateUrl: "user-profile-form-fields.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        UserProfileFormService,
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => UserProfileFormFieldsComponent)
        }
    ]
})
export class UserProfileFormFieldsComponent extends ComponentReference {
    kcContext = inject<KcContext>(KC_CONTEXT);
    userProfileFormService = inject(UserProfileFormService);
    doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);

    onIsFormSubmittable = output<boolean>();

    formState = this.userProfileFormService.formState;

    @ContentChild("beforField") beforeField: TemplateRef<unknown> | undefined;
    @ContentChild("afterField") afterField: TemplateRef<unknown> | undefined;

    constructor() {
        super();
        effect(() => {
            const isFormSubmittable = this.formState().isFormSubmittable;
            this.onIsFormSubmittable.emit(isFormSubmittable);
        });
    }

    onDispatch(formAction: FormAction) {
        this.userProfileFormService.dispatchFormAction(formAction);
    }
}

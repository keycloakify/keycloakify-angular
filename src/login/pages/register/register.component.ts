import { AsyncPipe, NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    signal
} from "@angular/core";
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from "keycloakify-angular";
import { ClassKey } from "keycloakify/login";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "../../classes/component-reference.class";
import { UserProfileFormFieldsComponent } from "../../components/user-profile-form-fields/user-profile-form-fields.component";
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives/kc-class.directive";
import { AdvancedMsgStrPipe } from "../../pipes/advanced-msg-str.pipe";
import { KcSanitizePipe } from "../../pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    selector: "kc-root",
    templateUrl: "./register.component.html",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        KcClassDirective,
        AsyncPipe,
        KcSanitizePipe,
        NgClass,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        MsgStrPipe,
        AdvancedMsgStrPipe
    ],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => RegisterComponent)
        }
    ]
})
export class RegisterComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: "register.ftl" }>>(KC_CONTEXT);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    isFormSubmittable = signal(false);
    areTermsAccepted = signal(false);
    displayInfo: boolean = false;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError("global");

    onCallback() {
        (document.getElementById("kc-register-form") as HTMLFormElement).submit();
    }
}

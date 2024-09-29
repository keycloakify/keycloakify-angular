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
import { LogoutOtherSessionsComponent } from "../../components/logout-other-sessions/logout-other-sessions.component";
import { UserProfileFormFieldsComponent } from "../../components/user-profile-form-fields/user-profile-form-fields.component";
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        KcClassDirective,
        UserProfileFormFieldsComponent,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "update-email.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => UpdateEmailComponent)
        }
    ]
})
export class UpdateEmailComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: "update-email.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(true);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.exists("global");
    isFormSubmittable = signal(false);
}

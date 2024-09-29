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
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [
        MsgStrPipe,
        TemplateComponent,
        KcClassDirective,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "login-recovery-authn-code-config.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginRecoveryAuthnCodeConfigComponent)
        }
    ]
})
export class LoginRecoveryAuthnCodeConfigComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "login-recovery-authn-code-config.ftl" }>>(
            KC_CONTEXT
        );
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;
    toggleRecoveryCodesConfirmation = signal(false);

    olRecoveryCodesListId = "kc-recovery-codes-list";
}

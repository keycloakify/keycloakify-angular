import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input
} from "@angular/core";
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from "keycloakify-angular";
import { ClassKey } from "keycloakify/login";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "../../classes/component-reference.class";
import { LogoutOtherSessionsComponent } from "../../components/logout-other-sessions/logout-other-sessions.component";
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives/kc-class.directive";
import { AdvancedMsgStrPipe } from "../../pipes/advanced-msg-str.pipe";
import { KcSanitizePipe } from "../../pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        AdvancedMsgStrPipe,
        KcClassDirective,
        KcSanitizePipe,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "login-config-totp.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginConfigTotpComponent)
        }
    ]
})
export class LoginConfigTotpComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "login-config-totp.ftl" }>>(KC_CONTEXT);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.existsError(
        "totp",
        "userLabel"
    );
}

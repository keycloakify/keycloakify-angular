import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input
} from "@angular/core";
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/public-api";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { LogoutOtherSessionsComponent } from "@keycloakify/angular/login/components/logout-other-sessions/logout-other-sessions.component";
import { PasswordWrapperComponent } from "@keycloakify/angular/login/components/password-wrapper/password-wrapper.component";
import { TemplateComponent } from "@keycloakify/angular/login/containers/template.component";
import { KcClassDirective } from "@keycloakify/angular/login/directives";
import { KcSanitizePipe } from "@keycloakify/angular/login/pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        KcClassDirective,
        PasswordWrapperComponent,
        KcSanitizePipe,
        LogoutOtherSessionsComponent
    ],
    selector: "kc-root",
    templateUrl: "login-update-password.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginUpdatePasswordComponent)
        }
    ]
})
export class LoginUpdatePasswordComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "login-update-password.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo = false;
    displayMessage = !this.kcContext.messagesPerField.existsError(
        "password",
        "password-confirm"
    );
}

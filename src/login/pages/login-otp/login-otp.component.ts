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
} from "@keycloakify/angular/lib/providers/keycloakify-angular.providers";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { TemplateComponent } from "@keycloakify/angular/login/containers/template.component";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { KcSanitizePipe } from "@keycloakify/angular/login/pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, MsgStrPipe, KcSanitizePipe],
    selector: "kc-root",
    templateUrl: "login-otp.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginOtpComponent)
        }
    ]
})
export class LoginOtpComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: "login-otp.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.existsError("totp");
}

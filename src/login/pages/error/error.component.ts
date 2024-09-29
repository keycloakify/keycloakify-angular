import { ChangeDetectionStrategy, Component, forwardRef, inject } from "@angular/core";
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/providers/keycloakify-angular.providers";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { TemplateComponent } from "@keycloakify/angular/login/containers/template.component";
import { KcSanitizePipe } from "@keycloakify/angular/login/pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe, KcSanitizePipe],
    selector: "kc-root",
    templateUrl: "error.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => ErrorComponent)
        }
    ]
})
export class ErrorComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: "error.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

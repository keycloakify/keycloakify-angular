import { ChangeDetectionStrategy, Component, forwardRef, inject } from "@angular/core";
import {
    CLASSES,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/providers/keycloakify-angular.providers";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";

@Component({
    selector: "kc-logout-other-sessions",
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    standalone: true,
    imports: [KcClassDirective, MsgStrPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./logout-other-sessions.component.html",
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LogoutOtherSessionsComponent)
        }
    ]
})
export class LogoutOtherSessionsComponent extends ComponentReference {
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

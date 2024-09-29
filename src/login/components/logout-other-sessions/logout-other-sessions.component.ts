import { ChangeDetectionStrategy, Component, forwardRef, inject } from "@angular/core";
import { CLASSES, USE_DEFAULT_CSS } from "keycloakify-angular";
import { ClassKey } from "keycloakify/login";
import { ComponentReference } from "../../classes/component-reference.class";
import { KcClassDirective } from "../../directives/kc-class.directive";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

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

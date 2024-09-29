import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    OnInit
} from "@angular/core";
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from "keycloakify-angular";
import { ClassKey } from "keycloakify/login";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "../../classes/component-reference.class";
import { TemplateComponent } from "../../containers/template.component";
import { KcSanitizePipe } from "../../pipes/kc-sanitize.pipe";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe, KcSanitizePipe],
    selector: "kc-root",
    templateUrl: "frontchannel-logout.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => FrontchannelLogoutComponent)
        }
    ]
})
export class FrontchannelLogoutComponent extends ComponentReference implements OnInit {
    kcContext =
        inject<Extract<KcContext, { pageId: "frontchannel-logout.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;

    ngOnInit(): void {
        if (this.kcContext.logout.logoutRedirectUri) {
            window.location.replace(this.kcContext.logout.logoutRedirectUri);
        }
    }
}

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
import { TemplateComponent } from "../../containers/template.component";
import { KcClassDirective } from "../../directives";
import { MsgStrPipe } from "../../pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [MsgStrPipe, TemplateComponent, KcClassDirective],
    selector: "kc-root",
    templateUrl: "terms.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TermsComponent)
        }
    ]
})
export class TermsComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: "terms.ftl" }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;
}

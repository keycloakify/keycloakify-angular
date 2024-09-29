import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    signal
} from "@angular/core";
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/providers/keycloakify-angular.providers";
import { ClassKey } from "keycloakify/login/lib/kcClsx";
import { KcContext } from "keycloakify/login/KcContext";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { UserProfileFormFieldsComponent } from "@keycloakify/angular/login/components/user-profile-form-fields/user-profile-form-fields.component";
import { TemplateComponent } from "@keycloakify/angular/login/containers/template.component";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";

@Component({
    standalone: true,
    imports: [
        TemplateComponent,
        MsgStrPipe,
        UserProfileFormFieldsComponent,
        KcClassDirective
    ],
    selector: "kc-root",
    templateUrl: "idp-review-user-profile.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => IdpReviewUserProfileComponent)
        }
    ]
})
export class IdpReviewUserProfileComponent extends ComponentReference {
    kcContext =
        inject<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>>(KC_CONTEXT);
    displayRequiredFields = input(true);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    isFormSubmittable = signal(false);
    displayInfo: boolean = false;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError("global");

    onCallback() {
        (document.getElementById("kc-register-form") as HTMLFormElement).submit();
    }
}

import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [KcClassDirective, TemplateComponent, MsgStrPipe],
    selector: 'kc-root',
    templateUrl: 'login-idp-link-confirm-override.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginIdpLinkConfirmOverrideComponent)
        }
    ]
})
export class LoginIdpLinkConfirmOverrideComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-idp-link-confirm-override.ftl' }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;
}

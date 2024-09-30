import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions/logout-other-sessions.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe, KcClassDirective, LogoutOtherSessionsComponent],
    selector: 'kc-root',
    templateUrl: 'webauthn-error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => WebauthnErrorComponent)
        }
    ]
})
export class WebauthnErrorComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'webauthn-error.ftl' }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = true;

    onClick() {
        // @ts-expect-error: Trusted Keycloak's code
        document.getElementById('isSetRetry').value = 'retry';
        // @ts-expect-error: Trusted Keycloak's code
        document.getElementById('executionValue').value = '${execution}';
        // @ts-expect-error: Trusted Keycloak's code
        document.getElementById('kc-error-credential-form').submit();
    }
}

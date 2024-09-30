import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions/logout-other-sessions.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { I18n } from '../../i18n';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, LogoutOtherSessionsComponent],
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
    kcContext = inject<Extract<KcContext, { pageId: 'webauthn-error.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
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

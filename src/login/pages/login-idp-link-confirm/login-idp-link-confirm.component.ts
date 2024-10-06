import { ChangeDetectionStrategy, Component, forwardRef, inject, TemplateRef, viewChild } from '@angular/core';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';

@Component({
    standalone: true,
    imports: [KcClassDirective],
    selector: 'kc-login-idp-link-confirm',
    templateUrl: 'login-idp-link-confirm.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginIdpLinkConfirmComponent)
        }
    ]
})
export class LoginIdpLinkConfirmComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-idp-link-confirm.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage = !this.kcContext.messagesPerField.existsError('totp', 'userLabel');

    headerNode? = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode? = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode? = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');
}

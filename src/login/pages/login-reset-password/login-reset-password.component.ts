import { ChangeDetectionStrategy, Component, forwardRef, inject, type TemplateRef, viewChild } from '@angular/core';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    standalone: true,
    imports: [KcClassDirective, KcSanitizePipe],
    selector: 'kc-login-reset-password',
    templateUrl: 'login-reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginResetPasswordComponent)
        }
    ]
})
export class LoginResetPasswordComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-reset-password.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage: boolean = this.kcContext.messagesPerField.existsError('username');

    headerNode? = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode? = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode? = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');
}

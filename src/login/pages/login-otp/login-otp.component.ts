import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type I18n } from '@keycloakify/angular/login/i18n';
import { type KcContext } from '@keycloakify/angular/login/KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, KcSanitizePipe],
    selector: 'kc-root',
    templateUrl: 'login-otp.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginOtpComponent)
        }
    ]
})
export class LoginOtpComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-otp.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.existsError('totp');
}

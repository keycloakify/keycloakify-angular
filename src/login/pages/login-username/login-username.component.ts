import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { KcSanitizePipe } from '@keycloakify/angular/login/pipes/kc-sanitize.pipe';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { I18n } from '../../i18n';
import { KcContext } from '../../KcContext';

@Component({
    selector: 'kc-root',
    templateUrl: './login-username.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective, AsyncPipe, KcSanitizePipe, NgClass, TemplateComponent],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginUsernameComponent)
        }
    ]
})
export class LoginUsernameComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login-username.ftl' }>>(KC_LOGIN_CONTEXT);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    isLoginButtonDisabled = signal(false);
    displayInfo: boolean = !!this.kcContext?.realm?.password && !!this.kcContext?.realm?.registrationAllowed && !this.kcContext?.registrationDisabled;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('username');
}

import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { PasswordWrapperComponent } from '@keycloakify/angular/login/components/password-wrapper';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    selector: 'kc-root',
    templateUrl: './login.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective, AsyncPipe, KcSanitizePipe, PasswordWrapperComponent, NgClass, TemplateComponent, CommonModule],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginComponent)
        }
    ]
})
export class LoginComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login.ftl' }>>(KC_LOGIN_CONTEXT);
    _displayRequiredFields = false;
    _documentTitle: string | undefined;
    _bodyClassName: string | undefined;
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    isLoginButtonDisabled = signal(false);
    _displayInfo: boolean =
        !!this.kcContext?.realm?.password && !!this.kcContext?.realm?.registrationAllowed && !this.kcContext?.registrationDisabled;
    _displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('username', 'password');

    @ViewChild('headerNode', { static: true, read: TemplateRef }) headerNode?: TemplateRef<HTMLElement>;
    @ViewChild('infoNode', { static: true, read: TemplateRef }) infoNode?: TemplateRef<HTMLElement>;
    @ViewChild('socialProvidersNode', { static: true, read: TemplateRef }) socialProvidersNode?: TemplateRef<HTMLElement>;
}

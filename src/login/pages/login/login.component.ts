import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from '../../KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { PasswordWrapperComponent } from '@keycloakify/angular/login/components/password-wrapper/password-wrapper.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { KcSanitizePipe } from '@keycloakify/angular/login/pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    selector: 'kc-root',
    templateUrl: './login.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective, AsyncPipe, KcSanitizePipe, PasswordWrapperComponent, NgClass, TemplateComponent, MsgStrPipe],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginComponent)
        }
    ]
})
export class LoginComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'login.ftl' }>>(KC_CONTEXT);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    isLoginButtonDisabled = signal(false);
    displayInfo: boolean = !!this.kcContext?.realm?.password && !!this.kcContext?.realm?.registrationAllowed && !this.kcContext?.registrationDisabled;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('username', 'password');
}

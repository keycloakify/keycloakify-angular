import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, signal } from '@angular/core';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/account/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/account/directives/kc-class.directive';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes.token';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n.token';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context.token';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { type ClassKey } from 'keycloakify/account';
import { type I18n } from '../../i18n';
import { type KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [KcClassDirective, TemplateComponent, NgClass],
    selector: 'kc-root',
    templateUrl: 'password.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => PasswordComponent)
        }
    ]
})
export class PasswordComponent extends ComponentReference {
    i18n = inject<I18n>(ACCOUNT_I18N);
    kcContext = inject<Extract<KcContext, { pageId: 'password.ftl' }>>(KC_ACCOUNT_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
    override additionalClasses: Partial<Record<ClassKey, string>> = {
        kcBodyClass: `${this.classes?.kcBodyClass} password`
    };

    currentPassword = signal('');
    newPassword = signal('');
    newPasswordConfirm = signal('');
    newPasswordError = signal('');
    newPasswordConfirmError = signal('');
    hasNewPasswordBlurred = signal(false);
    hasNewPasswordConfirmBlurred = signal(false);

    constructor() {
        super();
        // @ts-ignore
        window.kcContext = {
            ...this.kcContext,
            message: (() => {
                if (this.newPasswordError() !== '') {
                    return {
                        type: 'error',
                        summary: this.newPasswordError()
                    };
                }
                if (this.newPasswordConfirmError() !== '') {
                    return {
                        type: 'error',
                        summary: this.newPasswordConfirmError()
                    };
                }
                return this.kcContext.message;
            })()
        };
    }

    checkNewPassword(newPassword: string) {
        if (!this.kcContext.password.passwordSet) return;
        if (newPassword === this.currentPassword()) {
            this.newPasswordError.set('newPasswordSameAsOld');
        } else {
            this.newPasswordError.set('');
        }
    }
    checkNewPasswordConfirm(newPasswordConfirm: string) {
        if (newPasswordConfirm === '') return;
        if (newPasswordConfirm !== this.newPassword()) {
            this.newPasswordConfirmError.set('passwordConfirmNotMatch');
        } else {
            this.newPasswordConfirmError.set('');
        }
    }

    onNewPasswordChange(value: string) {
        const newPassword = value;

        this.newPassword.set(newPassword);
        if (this.hasNewPasswordBlurred()) {
            this.checkNewPassword(newPassword);
        }
    }

    onNewPasswordBlur() {
        this.hasNewPasswordBlurred.set(true);
        this.checkNewPassword(this.newPassword());
    }

    onNewPasswordConfirmChange(value: string) {
        const newPasswordConfirm = value;

        this.newPasswordConfirm.set(newPasswordConfirm);
        if (this.hasNewPasswordConfirmBlurred()) {
            this.checkNewPasswordConfirm(newPasswordConfirm);
        }
    }

    onNewPasswordConfirmBlur() {
        this.hasNewPasswordConfirmBlurred.set(true);
        this.checkNewPasswordConfirm(this.newPasswordConfirm());
    }
}
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, Renderer2, signal, WritableSignal } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '@keycloakify/angular/login/i18n';

@Component({
    selector: 'kc-password-wrapper',
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective],
    templateUrl: 'password-wrapper.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => PasswordWrapperComponent)
        }
    ]
})
export class PasswordWrapperComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    private renderer = inject(Renderer2);
    passwordInputId = input.required<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    isPasswordRevealed: WritableSignal<boolean> = signal(false);

    togglePasswordVisibility(): void {
        this.isPasswordRevealed.update(revealed => !revealed);
        this.setPasswordInputType();
    }

    private setPasswordInputType(): void {
        const input = document.getElementById(this.passwordInputId());
        if (input) {
            this.renderer.setProperty(input, 'type', this.isPasswordRevealed() ? 'text' : 'password');
        }
    }
}

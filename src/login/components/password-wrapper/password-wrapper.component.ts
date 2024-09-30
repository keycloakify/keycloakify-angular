import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, Renderer2, signal, WritableSignal } from '@angular/core';
import { CLASSES, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    selector: 'kc-password-wrapper',
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective, AsyncPipe, MsgStrPipe],
    templateUrl: './password-wrapper.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => PasswordWrapperComponent)
        }
    ]
})
export class PasswordWrapperComponent extends ComponentReference {
    private renderer = inject(Renderer2);
    passwordInputId = input.required<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);

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

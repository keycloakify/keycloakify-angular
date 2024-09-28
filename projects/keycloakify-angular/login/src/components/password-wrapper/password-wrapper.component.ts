import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  selector: 'kc-password-wrapper',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KcClassDirective, AsyncPipe, MsgStrPipe],
  templateUrl: './password-wrapper.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => PasswordWrapperComponent),
    },
  ],
})
export class PasswordWrapperComponent extends ComponentReference {
  private renderer = inject(Renderer2);
  passwordInputId = input.required<string>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();

  isPasswordRevealed: WritableSignal<boolean> = signal(false);

  togglePasswordVisibility(): void {
    this.isPasswordRevealed.update((revealed) => !revealed);
    this.setPasswordInputType();
  }

  private setPasswordInputType(): void {
    const input = document.getElementById(this.passwordInputId());
    if (input) {
      this.renderer.setProperty(input, 'type', this.isPasswordRevealed() ? 'text' : 'password');
    }
  }
}

import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { KcTranslatePipe } from '../../pipes/kcTranslate.pipe';

@Directive({
  selector: '[kcInput]',
  standalone: true,
})
export class KcInputDirective {
  el = inject<ElementRef<HTMLInputElement>>(ElementRef);
}

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
  imports: [KcClassDirective, KcTranslatePipe, AsyncPipe],
  templateUrl: './password-wrapper.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => PasswordWrapperComponent),
    },
  ],
})
export class PasswordWrapperComponent extends ComponentReference implements AfterContentInit {
  @ContentChild(KcInputDirective, { static: true }) input: KcInputDirective | undefined;
  passwordInputId = input<string>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();

  isPasswordRevealed: WritableSignal<boolean> = signal(false);

  ngAfterContentInit(): void {
    this.setPasswordInputType();
  }

  togglePasswordVisibility(): void {
    this.isPasswordRevealed.update((revealed) => !revealed);
    this.setPasswordInputType();
  }

  private setPasswordInputType(): void {
    if (this.input) {
      this.input.el.nativeElement.type = this.isPasswordRevealed() ? 'text' : 'password';
    }
  }
}

import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, signal } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/account';
import { KcContext } from 'keycloakify/account/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { MsgStrPipe } from '../../pipes';

@Component({
  standalone: true,
  imports: [KcClassDirective, TemplateComponent, MsgStrPipe, NgClass],
  selector: 'kc-root',
  templateUrl: 'password.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => PasswordComponent),
    },
  ],
})
export class PasswordComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'password.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
  override additionalClasses: Partial<Record<ClassKey, string>> = {
    kcBodyClass: `${this.classes?.kcBodyClass} password`,
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
    window.kcContext = {
      ...this.kcContext,
      message: (() => {
        if (this.newPasswordError() !== '') {
          return {
            type: 'error',
            summary: this.newPasswordError(),
          };
        }
        if (this.newPasswordConfirmError() !== '') {
          return {
            type: 'error',
            summary: this.newPasswordConfirmError(),
          };
        }
        return this.kcContext.message;
      })(),
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

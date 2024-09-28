import { NgClass } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/account';
import { KcContext } from 'keycloakify/account/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { AdvancedMsgStrPipe, KcSanitizePipe, MsgStrPipe } from '../../pipes';

@Component({
  standalone: true,
  imports: [KcClassDirective, TemplateComponent, MsgStrPipe, AdvancedMsgStrPipe, KcSanitizePipe, NgClass],
  selector: 'kc-root',
  templateUrl: 'totp.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => TotpComponent),
    },
  ],
})
export class TotpComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'totp.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

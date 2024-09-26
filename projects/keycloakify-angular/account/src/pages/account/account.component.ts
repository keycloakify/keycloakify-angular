import { Component, forwardRef, inject, input } from '@angular/core';
import { ComponentReference } from '../../classes/component-reference.class';
import { KcContext } from 'keycloakify/account/KcContext';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/account';
import { KcClassDirective } from '../../directives';
import { TemplateComponent } from '../../containers/template.component';
import { MsgStrPipe } from '../../pipes';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  imports: [KcClassDirective, TemplateComponent, MsgStrPipe, NgClass],
  selector: 'kc-root',
  templateUrl: 'account.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => AccountComponent),
    },
  ],
})
export class AccountComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'account.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  override additionalClasses: Partial<Record<ClassKey, string>> = {
    kcBodyClass: `${this.classes()?.kcBodyClass} user`,
  };
}

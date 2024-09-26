import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, input } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
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
  templateUrl: 'applications.component.html',
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => ApplicationsComponent),
    },
  ],
})
export class ApplicationsComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'applications.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}

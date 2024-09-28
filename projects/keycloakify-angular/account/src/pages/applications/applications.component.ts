import { KeyValuePipe, NgClass } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/account';
import { KcContext } from 'keycloakify/account/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcClassDirective } from '../../directives';
import { AdvancedMsgStrPipe, MsgStrPipe } from '../../pipes';
import { IsArrayWithEmptyObjectPipe } from '../../pipes/is-array-with-empty-object.pipe';

@Component({
  standalone: true,
  imports: [
    KcClassDirective,
    TemplateComponent,
    MsgStrPipe,
    AdvancedMsgStrPipe,
    NgClass,
    KeyValuePipe,
    IsArrayWithEmptyObjectPipe,
  ],
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
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

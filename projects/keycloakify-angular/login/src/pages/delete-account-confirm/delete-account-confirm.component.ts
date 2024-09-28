import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';

@Component({
  standalone: true,
  imports: [],
  selector: 'kc-root',
  templateUrl: 'delete-account-confirm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => DeleteAccountConfirmComponent),
    },
  ],
})
export class DeleteAccountConfirmComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'delete-account-confirm.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

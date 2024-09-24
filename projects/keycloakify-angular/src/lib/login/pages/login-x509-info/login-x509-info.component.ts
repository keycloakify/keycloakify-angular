import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';

@Component({
  standalone: true,
  imports: [],
  selector: 'kc-root',
  templateUrl: 'login-x509-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => LoginX509InfoComponent),
    },
  ],
})
export class LoginX509InfoComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'login-x509-info.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
}

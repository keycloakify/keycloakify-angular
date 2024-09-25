import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { KcSanitizePipe } from '../../pipes';
import { AdvancedMsgStrPipe } from '../../pipes/advanced-msg-str.pipe';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';
import { KC_CONTEXT } from '../../providers/keycloakify-angular.providers';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe, KcSanitizePipe, AdvancedMsgStrPipe],
  selector: 'kc-root',
  templateUrl: 'info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AdvancedMsgStrPipe,
    MsgStrPipe,
    KcSanitizePipe,
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => InfoComponent),
    },
  ],
})
export class InfoComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'info.ftl' }>>(KC_CONTEXT);
  advancedMsgStr = inject(AdvancedMsgStrPipe);
  kcSanitize = inject(KcSanitizePipe);
  msgStr = inject(MsgStrPipe);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = false;

  get infoMessage() {
    let html = this.kcContext.message.summary;
    if (this.kcContext.requiredActions) {
      html += '<b>';

      html += this.kcContext.requiredActions
        .map((requiredAction) => this.advancedMsgStr.transform(`requiredAction.${requiredAction}`))
        .join(', ');

      html += '</b>';
    }
    return html;
  }
}

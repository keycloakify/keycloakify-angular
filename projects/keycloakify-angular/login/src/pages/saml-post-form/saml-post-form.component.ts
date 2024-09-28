import { ChangeDetectionStrategy, Component, forwardRef, inject, input, ViewChild } from '@angular/core';
import { KC_CONTEXT } from 'keycloakify-angular';
import { ClassKey } from 'keycloakify/login';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '../../classes/component-reference.class';
import { TemplateComponent } from '../../containers/template.component';
import { MsgStrPipe } from '../../pipes/msg-str.pipe';

@Component({
  standalone: true,
  imports: [TemplateComponent, MsgStrPipe],
  selector: 'kc-root',
  templateUrl: 'saml-post-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => SamlPostFormComponent),
    },
  ],
})
export class SamlPostFormComponent extends ComponentReference {
  kcContext = inject<Extract<KcContext, { pageId: 'saml-post-form.ftl' }>>(KC_CONTEXT);
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();
  displayInfo: boolean = false;
  displayMessage: boolean = true;
  @ViewChild('setHtmlFormElement')
  htmlFormElement!: HTMLFormElement;

  constructor() {
    super();
    if (this.htmlFormElement === null) {
      return;
    }

    if (this.kcContext.samlPost.url === '#') {
      alert('In a real Keycloak the user would be redirected immediately');
      return;
    }

    this.htmlFormElement.submit();
  }
}

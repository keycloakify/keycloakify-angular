import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import { Attribute, ClassKey } from 'keycloakify/login';
import { ComponentReference } from '../../classes/component-reference.class';
import { AttributesDirective } from '../../directives/attributes.directive';
import { KcClassDirective } from '../../directives/kc-class.directive';
import { KcTranslatePipe } from '../../pipes/kcTranslate.pipe';

@Component({
  standalone: true,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  imports: [KcClassDirective, AttributesDirective, KcTranslatePipe],
  selector: 'kc-group-label',
  templateUrl: 'group-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => GroupLabelComponent),
    },
  ],
})
export class GroupLabelComponent extends ComponentReference {
  attribute = input<Attribute>();
  groupName = input<string>();
  override doUseDefaultCss = input<boolean>();
  override classes = input<Partial<Record<ClassKey, string>>>();
  groupNameRef = computed(() => {
    const attribute = this.attribute();
    const groupName = this.groupName();
    if (attribute?.group?.name !== groupName) {
      return attribute?.group?.name ?? '';
    }
    return '';
  });
}

import {
    ChangeDetectionStrategy,
    Component,
    computed,
    forwardRef,
    inject,
    input
} from '@angular/core';
import { CLASSES, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { Attribute } from 'keycloakify/login/KcContext';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { AttributesDirective } from '@keycloakify/angular/login/directives/attributes.directive';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { AdvancedMsgStrPipe } from '@keycloakify/angular/login/pipes/advanced-msg-str.pipe';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective, AttributesDirective, AdvancedMsgStrPipe],
    selector: 'kc-group-label',
    templateUrl: 'group-label.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => GroupLabelComponent)
        }
    ]
})
export class GroupLabelComponent extends ComponentReference {
    attribute = input<Attribute>();
    groupName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    groupNameRef = computed(() => {
        const attribute = this.attribute();
        const groupName = this.groupName();
        if (attribute?.group?.name !== groupName) {
            return attribute?.group?.name ?? '';
        }
        return '';
    });
}

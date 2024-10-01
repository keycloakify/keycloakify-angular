import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { AttributesDirective } from '@keycloakify/angular/lib/directives/attributes.directive';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { type Attribute } from 'keycloakify/login/KcContext';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type I18n } from '../../i18n';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective, AttributesDirective],
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
    i18n = inject<I18n>(LOGIN_I18N);
    attribute = input<Attribute>();
    groupName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    groupNameRef = computed(() => {
        const attribute = this.attribute();
        const groupName = this.groupName();
        if (attribute?.group?.name !== groupName) {
            return attribute?.group?.name ?? '';
        }
        return '';
    });
}

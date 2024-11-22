import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { type FormFieldError } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { type Attribute } from 'keycloakify/login/KcContext';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective],
    selector: 'kc-field-errors',
    templateUrl: 'field-errors.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => FieldErrorsComponent)
        }
    ]
})
export class FieldErrorsComponent extends ComponentReference {
    attribute = input<Attribute>();
    displayableErrors = input<FormFieldError[]>();
    fieldIndex = input<number>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
}

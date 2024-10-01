import { DatePipe, NgClass } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/account/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/account/directives/kc-class.directive';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes.token';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n.token';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context.token';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { type ClassKey } from 'keycloakify/account';
import { type I18n } from '../../i18n';
import { type KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [KcClassDirective, TemplateComponent, NgClass, DatePipe],
    selector: 'kc-root',
    templateUrl: 'log.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LogComponent)
        }
    ]
})
export class LogComponent extends ComponentReference {
    i18n = inject<I18n>(ACCOUNT_I18N);
    kcContext = inject<Extract<KcContext, { pageId: 'log.ftl' }>>(KC_ACCOUNT_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
}

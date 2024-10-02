import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { type I18n } from '@keycloakify/angular/login/i18n';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective],
    selector: 'kc-root',
    templateUrl: 'code.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => CodeComponent)
        }
    ]
})
export class CodeComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'code.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
}

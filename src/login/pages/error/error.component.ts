import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcSanitizePipe } from '@keycloakify/angular/login/pipes/kc-sanitize.pipe';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { type I18n } from '../../i18n';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcSanitizePipe],
    selector: 'kc-root',
    templateUrl: 'error.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => ErrorComponent)
        }
    ]
})
export class ErrorComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'error.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
}

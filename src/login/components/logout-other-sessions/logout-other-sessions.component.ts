import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type I18n } from '../../i18n';

@Component({
    selector: 'kc-logout-other-sessions',
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    standalone: true,
    imports: [KcClassDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './logout-other-sessions.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LogoutOtherSessionsComponent)
        }
    ]
})
export class LogoutOtherSessionsComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
}

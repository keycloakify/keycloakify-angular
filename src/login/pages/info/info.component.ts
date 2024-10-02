import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcSanitizePipe],
    selector: 'kc-root',
    templateUrl: 'info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => InfoComponent)
        }
    ]
})
export class InfoComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'info.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;

    get infoMessage() {
        let html = this.kcContext.message.summary;
        if (this.kcContext.requiredActions) {
            html += '<b>';

            html += this.kcContext.requiredActions.map(requiredAction => this.i18n.advancedMsgStr(`requiredAction.${requiredAction}`)).join(', ');

            html += '</b>';
        }
        return html;
    }
}

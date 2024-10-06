import { NgClass } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/account/directives/kc-class';
import type { I18n } from '@keycloakify/angular/account/i18n';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import type { ClassKey } from 'keycloakify/account';

@Component({
    standalone: true,
    imports: [KcClassDirective, KcSanitizePipe, NgClass],
    selector: 'kc-totp',
    templateUrl: 'totp.component.html',
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TotpComponent)
        }
    ]
})
export class TotpComponent extends ComponentReference {
    i18n = inject<I18n>(ACCOUNT_I18N);
    kcContext = inject<Extract<KcContext, { pageId: 'totp.ftl' }>>(KC_ACCOUNT_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
    active = 'totp';
}

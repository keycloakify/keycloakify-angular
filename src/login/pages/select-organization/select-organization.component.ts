import { ChangeDetectionStrategy, Component, type ElementRef, forwardRef, inject, signal, viewChild } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { TemplateSlots } from '@keycloakify/angular/login/classes/template-slots';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    imports: [KcClassDirective],
    selector: 'kc-select-organization',
    templateUrl: 'select-organization.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => SelectOrganizationComponent)
        }
    ]
})
export class SelectOrganizationComponent extends ComponentReference implements TemplateSlots {
    kcContext = inject<Extract<KcContext, { pageId: 'select-organization.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage = true;

    organizations = this.kcContext.user.organizations ?? [];
    shouldDisplayGrid = this.organizations.length > 3;

    isSubmitting = signal(false);

    formRef = viewChild<ElementRef<HTMLFormElement>>('formRef');
    organizationInputRef = viewChild<ElementRef<HTMLInputElement>>('organizationInputRef');

    selectOrganization(alias: string): void {
        const organizationInput = this.organizationInputRef()?.nativeElement;
        const form = this.formRef()?.nativeElement;
        if (!organizationInput || !form) {
            return;
        }

        organizationInput.value = alias;
        this.isSubmitting.set(true);
        form.requestSubmit();
    }
}

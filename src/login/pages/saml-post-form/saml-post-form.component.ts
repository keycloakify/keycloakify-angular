import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, inject, type TemplateRef, viewChild } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    standalone: true,
    imports: [],
    selector: 'kc-saml-post-form',
    templateUrl: 'saml-post-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => SamlPostFormComponent)
        }
    ]
})
export class SamlPostFormComponent extends ComponentReference implements AfterViewInit {
    kcContext = inject<Extract<KcContext, { pageId: 'saml-post-form.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage = true;

    headerNode? = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode? = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode? = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');
    htmlFormElement = viewChild<HTMLFormElement>('setHtmlFormElement');

    ngAfterViewInit(): void {
        if (this.htmlFormElement() === null || this.htmlFormElement() === undefined) {
            return;
        }

        if (this.kcContext.samlPost.url === '#') {
            alert('In a real Keycloak the user would be redirected immediately');
            return;
        }

        this.htmlFormElement()!.submit();
    }
}

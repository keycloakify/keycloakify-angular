import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, type TemplateRef, Type, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { UserProfileFormService } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { map } from 'rxjs';

@Component({
    imports: [KcClassDirective, NgComponentOutlet],
    selector: 'kc-login-update-profile',
    templateUrl: 'login-update-profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginUpdateProfileComponent)
        }
    ]
})
export class LoginUpdateProfileComponent extends ComponentReference {
    #userProfileFormService = inject(UserProfileFormService);
    kcContext = inject<Extract<KcContext, { pageId: 'login-update-profile.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = true;
    displayInfo = false;
    displayMessage: boolean = this.kcContext.messagesPerField.exists('global');

    headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

    isFormSubmittable = toSignal(this.#userProfileFormService.formState$.pipe(map(s => s.isFormSubmittable)), { initialValue: false });
    userProfileFormFields = input<Type<UserProfileFormFieldsComponent>>();
}

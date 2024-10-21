import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, type TemplateRef, Type, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { UserProfileFormService } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { map } from 'rxjs';

@Component({
    standalone: true,
    imports: [KcClassDirective, NgComponentOutlet, LogoutOtherSessionsComponent],
    selector: 'kc-update-email',
    templateUrl: 'update-email.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => UpdateEmailComponent)
        }
    ]
})
export class UpdateEmailComponent extends ComponentReference {
    #userProfileFormService = inject(UserProfileFormService);
    kcContext = inject<Extract<KcContext, { pageId: 'update-email.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = true;
    displayInfo = false;
    displayMessage = this.kcContext.messagesPerField.exists('global');

    headerNode = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

    userProfileFormFields = input<Type<UserProfileFormFieldsComponent>>();
    isFormSubmittable = toSignal(this.#userProfileFormService.formState$.pipe(map(s => s.isFormSubmittable)), { initialValue: false });
}

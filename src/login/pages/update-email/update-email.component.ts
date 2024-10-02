import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { LogoutOtherSessionsComponent } from '@keycloakify/angular/login/components/logout-other-sessions';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { SubmitService } from '@keycloakify/angular/login/services/submit';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, NgComponentOutlet, LogoutOtherSessionsComponent],
    selector: 'kc-root',
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
    #submitService = inject(SubmitService);
    kcContext = inject<Extract<KcContext, { pageId: 'update-email.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    displayRequiredFields = input(true);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.exists('global');
    isFormSubmittable = signal(false);

    userProfileFormFields = input<Type<UserProfileFormFieldsComponent>>();

    constructor() {
        super();
        this.#submitService.isSubmittable.pipe(takeUntilDestroyed()).subscribe(submittable => {
            this.isFormSubmittable.set(submittable);
        });
    }
}

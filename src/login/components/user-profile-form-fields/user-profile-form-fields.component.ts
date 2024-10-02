import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, effect, forwardRef, inject, output, TemplateRef } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { FieldErrorsComponent } from '@keycloakify/angular/login/components/field-errors';
import { GroupLabelComponent } from '@keycloakify/angular/login/components/group-label';
import { InputFieldByTypeComponent } from '@keycloakify/angular/login/components/input-field-by-type';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { type I18n } from '@keycloakify/angular/login/i18n';
import { type KcContext } from '@keycloakify/angular/login/KcContext';
import { SubmitService } from '@keycloakify/angular/login/services/submit';
import { type FormAction, UserProfileFormService } from '@keycloakify/angular/login/services/user-profile-form';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    standalone: true,
    styles: [
        `
            :host {
                display: contents;
            }
        `
    ],
    imports: [KcClassDirective, FieldErrorsComponent, InputFieldByTypeComponent, GroupLabelComponent, NgTemplateOutlet],
    selector: 'kc-user-profile-form-fields',
    templateUrl: 'user-profile-form-fields.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        UserProfileFormService,
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => UserProfileFormFieldsComponent)
        }
    ]
})
export class UserProfileFormFieldsComponent extends ComponentReference {
    i18n = inject<I18n>(LOGIN_I18N);
    kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
    userProfileFormService = inject(UserProfileFormService);
    #submitService = inject(SubmitService);
    doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    onIsFormSubmittable = output<boolean>();

    formState = this.userProfileFormService.formState;

    @ContentChild('beforField') beforeField: TemplateRef<unknown> | undefined;
    @ContentChild('afterField') afterField: TemplateRef<unknown> | undefined;

    constructor() {
        super();
        effect(
            () => {
                const isFormSubmittable = this.formState().isFormSubmittable;
                this.#submitService.setIsSubmittable(isFormSubmittable);
            },
            { allowSignalWrites: true }
        );
    }

    onDispatch(formAction: FormAction) {
        this.userProfileFormService.dispatchFormAction(formAction);
    }
}

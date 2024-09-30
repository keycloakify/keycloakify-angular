import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, effect, forwardRef, inject, output, TemplateRef } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { FieldErrorsComponent } from '@keycloakify/angular/login/components/field-errors/field-errors.component';
import { GroupLabelComponent } from '@keycloakify/angular/login/components/group-label/group-label.component';
import { InputFieldByTypeComponent } from '@keycloakify/angular/login/components/input-field-by-type/input-field-by-type.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { FormAction, UserProfileFormService } from '@keycloakify/angular/login/services/user-profile-form.service';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password.token';
import { KcContext } from 'keycloakify/login/KcContext';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { I18n } from '../../i18n';

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
    doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    onIsFormSubmittable = output<boolean>();

    formState = this.userProfileFormService.formState;

    @ContentChild('beforField') beforeField: TemplateRef<unknown> | undefined;
    @ContentChild('afterField') afterField: TemplateRef<unknown> | undefined;

    constructor() {
        super();
        effect(() => {
            const isFormSubmittable = this.formState().isFormSubmittable;
            this.onIsFormSubmittable.emit(isFormSubmittable);
        });
    }

    onDispatch(formAction: FormAction) {
        this.userProfileFormService.dispatchFormAction(formAction);
    }
}

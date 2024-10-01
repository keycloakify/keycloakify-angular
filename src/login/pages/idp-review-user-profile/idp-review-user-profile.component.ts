import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields/user-profile-form-fields.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type I18n } from '../../i18n';
import { type KcContext } from '../../KcContext';
import { SubmitService } from '@keycloakify/angular/login/services/submit.service';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, NgComponentOutlet],
    selector: 'kc-root',
    templateUrl: 'idp-review-user-profile.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => IdpReviewUserProfileComponent)
        }
    ]
})
export class IdpReviewUserProfileComponent extends ComponentReference {
    #submitService = inject(SubmitService);

    kcContext = inject<Extract<KcContext, { pageId: 'idp-review-user-profile.ftl' }>>(KC_LOGIN_CONTEXT);
    displayRequiredFields = input(true);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    isFormSubmittable = signal(false);
    displayInfo: boolean = false;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('global');

    userProfileFormFields = input<Type<UserProfileFormFieldsComponent>>();

    constructor() {
        super();
        this.#submitService.isSubmittable.pipe(takeUntilDestroyed()).subscribe(submittable => {
            this.isFormSubmittable.set(submittable);
        });
    }

    onCallback() {
        (document.getElementById('kc-register-form') as HTMLFormElement).submit();
    }
}

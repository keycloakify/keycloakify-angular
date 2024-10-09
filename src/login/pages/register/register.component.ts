import { AsyncPipe, NgClass, NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal, type TemplateRef, Type, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import type { KcContext } from '@keycloakify/angular/login/KcContext';
import { SubmitService } from '@keycloakify/angular/login/services/submit';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

@Component({
    selector: 'kc-register',
    templateUrl: 'register.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [KcClassDirective, AsyncPipe, KcSanitizePipe, NgClass, NgComponentOutlet],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => RegisterComponent)
        }
    ]
})
export class RegisterComponent extends ComponentReference {
    #submitService = inject(SubmitService);
    kcContext = inject<Extract<KcContext, { pageId: 'register.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);

    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);

    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    displayRequiredFields = false;
    displayInfo = false;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('global');

    headerNode? = viewChild<TemplateRef<HTMLElement>>('headerNode');
    infoNode? = viewChild<TemplateRef<HTMLElement>>('infoNode');
    socialProvidersNode? = viewChild<TemplateRef<HTMLElement>>('socialProvidersNode');

    isFormSubmittable = signal(false);
    areTermsAccepted = signal(false);
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

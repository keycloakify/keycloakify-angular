import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields/user-profile-form-fields.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { type I18n } from '../../i18n';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { type ClassKey } from 'keycloakify/login/lib/kcClsx';
import { type KcContext } from '../../KcContext';

@Component({
    standalone: true,
    imports: [TemplateComponent, UserProfileFormFieldsComponent, KcClassDirective],
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

    onCallback() {
        (document.getElementById('kc-register-form') as HTMLFormElement).submit();
    }
}

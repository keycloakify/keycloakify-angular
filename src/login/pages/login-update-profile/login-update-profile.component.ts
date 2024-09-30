import { ChangeDetectionStrategy, Component, forwardRef, inject, input, signal } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields/user-profile-form-fields.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [TemplateComponent, KcClassDirective, MsgStrPipe, UserProfileFormFieldsComponent],
    selector: 'kc-root',
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
    kcContext = inject<Extract<KcContext, { pageId: 'login-update-profile.ftl' }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(true);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = this.kcContext.messagesPerField.exists('global');

    isFormSubmittable = signal(false);
}

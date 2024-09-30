import { AsyncPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    signal
} from '@angular/core';
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { UserProfileFormFieldsComponent } from '@keycloakify/angular/login/components/user-profile-form-fields/user-profile-form-fields.component';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { AdvancedMsgStrPipe } from '@keycloakify/angular/login/pipes/advanced-msg-str.pipe';
import { KcSanitizePipe } from '@keycloakify/angular/login/pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    selector: 'kc-root',
    templateUrl: './register.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        KcClassDirective,
        AsyncPipe,
        KcSanitizePipe,
        NgClass,
        TemplateComponent,
        UserProfileFormFieldsComponent,
        MsgStrPipe,
        AdvancedMsgStrPipe
    ],
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => RegisterComponent)
        }
    ]
})
export class RegisterComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'register.ftl' }>>(KC_CONTEXT);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    isFormSubmittable = signal(false);
    areTermsAccepted = signal(false);
    displayInfo: boolean = false;
    displayMessage: boolean = !this.kcContext?.messagesPerField?.existsError('global');

    onCallback() {
        (document.getElementById('kc-register-form') as HTMLFormElement).submit();
    }
}

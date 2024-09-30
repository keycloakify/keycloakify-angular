import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input
} from '@angular/core';
import {
    CLASSES,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe, KcClassDirective],
    selector: 'kc-root',
    templateUrl: 'login-oauth2-device-verify-user-code.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => LoginOauth2DeviceVerifyUserCodeComponent)
        }
    ]
})
export class LoginOauth2DeviceVerifyUserCodeComponent extends ComponentReference {
    kcContext =
        inject<
            Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>
        >(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = false;
}

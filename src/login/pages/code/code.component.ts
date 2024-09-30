import { ChangeDetectionStrategy, Component, forwardRef, inject } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from 'keycloakify/login/KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [MsgStrPipe, TemplateComponent, KcClassDirective],
    selector: 'kc-root',
    templateUrl: 'code.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => CodeComponent)
        }
    ]
})
export class CodeComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'code.ftl' }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
}

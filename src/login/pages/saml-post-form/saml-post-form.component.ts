import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, inject, input, ViewChild } from '@angular/core';
import { CLASSES, KC_CONTEXT, USE_DEFAULT_CSS } from '@keycloakify/angular/lib/public-api';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';
import { KcContext } from '../../KcContext';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { TemplateComponent } from '@keycloakify/angular/login/containers/template.component';
import { MsgStrPipe } from '@keycloakify/angular/login/pipes/msg-str.pipe';

@Component({
    standalone: true,
    imports: [TemplateComponent, MsgStrPipe],
    selector: 'kc-root',
    templateUrl: 'saml-post-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => SamlPostFormComponent)
        }
    ]
})
export class SamlPostFormComponent extends ComponentReference implements AfterViewInit {
    kcContext = inject<Extract<KcContext, { pageId: 'saml-post-form.ftl' }>>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();
    displayInfo: boolean = false;
    displayMessage: boolean = true;
    @ViewChild('setHtmlFormElement')
    htmlFormElement!: HTMLFormElement;

    ngAfterViewInit(): void {
        if (this.htmlFormElement === null) {
            return;
        }

        if (this.kcContext.samlPost.url === '#') {
            alert('In a real Keycloak the user would be redirected immediately');
            return;
        }

        this.htmlFormElement.submit();
    }
}

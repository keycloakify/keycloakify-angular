import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    effect,
    forwardRef,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { Observable } from 'rxjs';
import type { I18n } from '@keycloakify/angular/login/i18n';
import { KcContext } from '@keycloakify/angular/login/KcContext';

@Component({
    selector: 'kc-dynamic-page-injector',
    standalone: true,
    template: ``
})
export class DynamicPageInjectorComponent {
    page = input<Type<unknown>>();
    componentCreated = output<object>();
    vcr = inject<ViewContainerRef>(ViewContainerRef);
    constructor() {
        effect(
            () => {
                const page = this.page();
                if (!page) return;
                const compRef = this.vcr.createComponent(page);
                this.componentCreated.emit(compRef.instance as object);
            },
            { allowSignalWrites: true }
        );
    }
}

@Component({
    selector: 'kc-login-template',
    templateUrl: './template.component.html',
    standalone: true,
    imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, DynamicPageInjectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TemplateComponent)
        }
    ]
})
export class TemplateComponent extends ComponentReference implements OnInit {
    i18n = inject<I18n>(LOGIN_I18N);
    renderer = inject(Renderer2);
    meta = inject(Meta);
    title = inject(Title);
    kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    loginResourceInjectorService = inject(LoginResourceInjectorService);

    displayInfo = input(false);
    displayMessage = input(true);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();

    _displayInfo = false;
    _displayMessage = true;
    _displayRequiredFields = false;
    _documentTitle = '';
    _bodyClassName = '';

    isReadyToRender$: Observable<boolean>;

    page = input<Type<unknown>>();
    headerNode: TemplateRef<HTMLElement> | undefined;
    infoNode: TemplateRef<HTMLElement> | undefined;
    socialProvidersNode: TemplateRef<HTMLElement> | undefined;

    constructor() {
        super();

        this.title.setTitle(this._documentTitle ?? this.i18n.msgStr('loginTitle', this.kcContext.realm.displayName));
        this.isReadyToRender$ = this.loginResourceInjectorService.injectResource(this.doUseDefaultCss);
    }

    ngOnInit() {
        this.applyKcIndexClasses();
    }

    private applyKcIndexClasses() {
        const kcClsx = getKcClsx({
            doUseDefaultCss: this.doUseDefaultCss,
            classes: this.classes
        }).kcClsx;
        const kcBodyClass = this._bodyClassName ?? kcClsx('kcBodyClass');
        const kcHtmlClass = kcClsx('kcHtmlClass');
        const kcBodyClasses = kcBodyClass.split(/\s+/);
        const kcHtmlClasses = kcHtmlClass.split(/\s+/);
        kcBodyClasses.forEach(klass => {
            this.renderer.addClass(document.body, klass);
        });
        kcHtmlClasses.forEach(klass => {
            this.renderer.addClass(document.documentElement, klass);
        });
    }

    tryAnotherWay() {
        document.forms['kc-select-try-another-way-form' as never].submit();
    }

    onComponentCreated(compRef: object) {
        if ('_displayInfo' in compRef) {
            this._displayInfo = compRef._displayInfo as boolean;
        }
        if ('_displayMessage' in compRef) {
            this._displayMessage = compRef._displayMessage as boolean;
        }
        if ('_displayRequiredFields' in compRef) {
            this._displayRequiredFields = compRef._displayRequiredFields as boolean;
        }
        if ('_documentTitle' in compRef) {
            this._documentTitle = compRef._documentTitle as string;
        }
        if ('_bodyClassName' in compRef) {
            this._bodyClassName = compRef._bodyClassName as string;
        }
        if ('headerNode' in compRef) {
            this.headerNode = compRef.headerNode as TemplateRef<HTMLElement>;
        }
        if ('infoNode' in compRef) {
            this.infoNode = compRef.infoNode as TemplateRef<HTMLElement>;
        }
        if ('socialProvidersNode' in compRef) {
            this.socialProvidersNode = compRef.socialProvidersNode as TemplateRef<HTMLElement>;
        }
    }
}

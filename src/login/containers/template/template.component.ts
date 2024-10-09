import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    forwardRef,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    Signal,
    TemplateRef,
    Type,
    ViewContainerRef
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class';
import type { I18n } from '@keycloakify/angular/login/i18n';
import { KcContext } from '@keycloakify/angular/login/KcContext';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { type ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { Observable } from 'rxjs';

@Component({
    selector: 'kc-dynamic-page-injector',
    standalone: true,
    template: ``
})
export class DynamicPageInjectorComponent {
    page = input<Type<unknown>>();
    userProfileFormFields = input<Type<unknown>>();
    componentCreated = output<object>();
    #vcr = inject<ViewContainerRef>(ViewContainerRef);
    constructor() {
        effect(
            () => {
                const page = this.page();
                const userProfileFormFields = this.userProfileFormFields();
                if (!page) return;
                const compRef = this.#vcr.createComponent(page);
                if ('userProfileFormFields' in (compRef.instance as object) && userProfileFormFields) {
                    compRef.setInput('userProfileFormFields', userProfileFormFields);
                }
                this.componentCreated.emit(compRef.instance as object);
            },
            { allowSignalWrites: true }
        );
    }
}

@Component({
    selector: 'kc-root',
    templateUrl: 'template.component.html',
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
    #cdr = inject(ChangeDetectorRef);
    meta = inject(Meta);
    title = inject(Title);
    kcContext = inject<KcContext>(KC_LOGIN_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
    loginResourceInjectorService = inject(LoginResourceInjectorService);

    displayInfo = false;
    displayMessage = true;
    displayRequiredFields = false;
    documentTitle: string | undefined;
    bodyClassName: string | undefined;

    isReadyToRender$: Observable<boolean>;

    page = input<Type<unknown>>();
    userProfileFormFields = input<Type<unknown>>();
    headerNode: Signal<TemplateRef<HTMLElement>> | undefined;
    infoNode: Signal<TemplateRef<HTMLElement>> | undefined;
    socialProvidersNode: Signal<TemplateRef<HTMLElement>> | undefined;

    constructor() {
        super();

        this.title.setTitle(this.documentTitle ?? this.i18n.msgStr('loginTitle', this.kcContext.realm.displayName));
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
        const kcBodyClass = this.bodyClassName ?? kcClsx('kcBodyClass');
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
        if ('displayInfo' in compRef) {
            this.displayInfo = !!compRef.displayInfo as boolean;
        }
        if ('displayMessage' in compRef) {
            this.displayMessage = !!compRef.displayMessage as boolean;
        }
        if ('displayRequiredFields' in compRef) {
            this.displayRequiredFields = !!compRef.displayRequiredFields as boolean;
        }
        if ('documentTitle' in compRef && compRef.documentTitle) {
            this.documentTitle = compRef.documentTitle as string;
        }
        if ('bodyClassName' in compRef && compRef.bodyClassName) {
            this.bodyClassName = compRef.bodyClassName as string;
        }
        if ('headerNode' in compRef && compRef.headerNode) {
            this.headerNode = computed(() => {
                const headerNode = (compRef.headerNode as Signal<TemplateRef<HTMLElement>>)();
                return headerNode;
            });
        }
        if ('infoNode' in compRef && compRef.infoNode) {
            this.infoNode = computed(() => {
                const infoNode = (compRef.infoNode as Signal<TemplateRef<HTMLElement>>)();
                return infoNode;
            });
        }
        if ('socialProvidersNode' in compRef && compRef.socialProvidersNode) {
            this.socialProvidersNode = computed(() => {
                const socialProvidersNode = (compRef.socialProvidersNode as Signal<TemplateRef<HTMLElement>>)();
                return socialProvidersNode;
            });
        }
        this.#cdr.markForCheck();
    }
}

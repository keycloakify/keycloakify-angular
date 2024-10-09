import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    forwardRef,
    inject,
    input,
    OnInit,
    output,
    Renderer2,
    Type,
    ViewContainerRef
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/account/directives/kc-class';
import type { I18n } from '@keycloakify/angular/account/i18n';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { AccountResourceInjectorService } from '@keycloakify/angular/account/services/account-resource-injector';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ClassKey, getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { Observable } from 'rxjs';
type ActiveType = 'account' | 'password' | 'totp' | 'social' | 'sessions' | 'applications' | 'log' | 'authorization' | undefined;

@Component({
    selector: 'kc-dynamic-page-injector',
    standalone: true,
    template: ``
})
export class DynamicPageInjectorComponent {
    page = input<Type<unknown>>();
    componentCreated = output<object>();
    #vcr = inject<ViewContainerRef>(ViewContainerRef);
    constructor() {
        effect(
            () => {
                const page = this.page();
                if (!page) return;
                const compRef = this.#vcr.createComponent(page);
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
    imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, NgClass, DynamicPageInjectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TemplateComponent)
        }
    ]
})
export class TemplateComponent extends ComponentReference {
    i18n = inject<I18n>(ACCOUNT_I18N);
    renderer = inject(Renderer2);
    #cdr = inject(ChangeDetectorRef);
    meta = inject(Meta);
    title = inject(Title);
    kcContext = inject<KcContext>(KC_ACCOUNT_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
    accountResourceInjectorService = inject(AccountResourceInjectorService);

    isReadyToRender$: Observable<boolean>;

    page = input<Type<unknown>>();

    active: ActiveType;

    constructor() {
        super();

        this.isReadyToRender$ = this.accountResourceInjectorService.injectResource(this.doUseDefaultCss);
    }

    private applyKcIndexClasses() {
        const kcClsx = getKcClsx({
            doUseDefaultCss: this.doUseDefaultCss,
            classes: this.classes
        }).kcClsx;
        const kcBodyClass = kcClsx('kcBodyClass');
        const kcHtmlClass = kcClsx('kcHtmlClass');
        const kcBodyClasses = kcBodyClass.split(/\s+/);
        const kcHtmlClasses = kcHtmlClass.split(/\s+/);
        kcBodyClasses.push('admin-console', 'user');
        kcBodyClasses.forEach(klass => {
            this.renderer.addClass(document.body, klass);
        });
        kcHtmlClasses.forEach(klass => {
            this.renderer.addClass(document.documentElement, klass);
        });
    }

    onComponentCreated(compRef: object) {
        if ('active' in compRef && compRef.active) {
            this.active = compRef.active as ActiveType;
        }

        this.title.setTitle(this.i18n.msgStr('accountManagementTitle'));
        this.applyKcIndexClasses();
        this.#cdr.markForCheck();
    }
}

import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';
import { KcClassDirective } from '@keycloakify/angular/account/directives/kc-class';
import { AccountResourceInjectorService } from '@keycloakify/angular/account/services/account-resource-injector';
import { ACCOUNT_CLASSES } from '@keycloakify/angular/account/tokens/classes';
import { ACCOUNT_I18N } from '@keycloakify/angular/account/tokens/i18n';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { KcSanitizePipe } from '@keycloakify/angular/lib/pipes/kc-sanitize';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css';
import { ClassKey, getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { Observable } from 'rxjs';
import { type I18n } from '@keycloakify/angular/account/i18n';
import { type KcContext } from '@keycloakify/angular/account/KcContext';

@Component({
    selector: 'kc-account-template',
    templateUrl: './template.component.html',
    standalone: true,
    imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, NgClass],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TemplateComponent)
        }
    ]
})
export class TemplateComponent extends ComponentReference implements OnInit {
    i18n = inject<I18n>(ACCOUNT_I18N);
    renderer = inject(Renderer2);
    meta = inject(Meta);
    title = inject(Title);
    kcContext = inject<KcContext>(KC_ACCOUNT_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(ACCOUNT_CLASSES);
    accountResourceInjectorService = inject(AccountResourceInjectorService);

    active = input<'account' | 'password' | 'totp' | 'social' | 'sessions' | 'applications' | 'log' | 'authorization' | undefined>(undefined);

    isReadyToRender$: Observable<boolean>;

    constructor() {
        super();
        this.title.setTitle(this.i18n.msgStr('accountManagementTitle'));
        this.isReadyToRender$ = this.accountResourceInjectorService.injectResource(this.doUseDefaultCss);
    }

    ngOnInit() {
        this.applyKcIndexClasses();
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
}

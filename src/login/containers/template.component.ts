import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { I18n } from '@keycloakify/angular/login/i18n';
import { KcContext } from 'keycloakify/login/KcContext/KcContext';
import { ClassKey, getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { Observable } from 'rxjs';
import { ComponentReference } from '@keycloakify/angular/login/classes/component-reference.class';
import { KcClassDirective } from '@keycloakify/angular/login/directives/kc-class.directive';
import { KcSanitizePipe } from '@keycloakify/angular/login/pipes/kc-sanitize.pipe';
import { LoginResourceInjectorService } from '@keycloakify/angular/login/services/login-resource-injector.service';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n.token';
import { LOGIN_CLASSES } from '@keycloakify/angular/login/tokens/classes.token';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context.token';
import { USE_DEFAULT_CSS } from '@keycloakify/angular/lib/tokens/use-default-css.token';

@Component({
    selector: 'kc-login-template',
    templateUrl: './template.component.html',
    standalone: true,
    imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective],
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

    isReadyToRender$: Observable<boolean>;

    constructor() {
        super();
        this.title.setTitle(this.documentTitle() ?? this.i18n.msgStr('loginTitle', this.kcContext.realm.displayName));
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
        const kcBodyClass = this.bodyClassName() ?? kcClsx('kcBodyClass');
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
}

import { AsyncPipe, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    inject,
    input,
    OnInit,
    Renderer2
} from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import {
    CLASSES,
    I18N,
    KC_CONTEXT,
    USE_DEFAULT_CSS
} from "@keycloakify/angular/lib/public-api";
import type { I18n } from "@keycloakify/angular/login/i18n";
import { KcContext } from "keycloakify/login/KcContext/KcContext";
import { ClassKey, getKcClsx } from "keycloakify/login/lib/kcClsx";
import { Observable } from "rxjs";
import { ComponentReference } from "@keycloakify/angular/login/classes/component-reference.class";
import { KcClassDirective } from "@keycloakify/angular/login/directives/kc-class.directive";
import { KcSanitizePipe } from "@keycloakify/angular/login/pipes";
import { MsgStrPipe } from "@keycloakify/angular/login/pipes/msg-str.pipe";
import { LoginResourceInjectorService } from "@keycloakify/angular/login/services/login-resource-injector.service";

@Component({
    selector: "kc-login-template",
    templateUrl: "./template.component.html",
    standalone: true,
    imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, MsgStrPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ComponentReference,
            useExisting: forwardRef(() => TemplateComponent)
        }
    ]
})
export class TemplateComponent extends ComponentReference implements OnInit {
    i18n = inject<I18n>(I18N);
    renderer = inject(Renderer2);
    meta = inject(Meta);
    title = inject(Title);
    kcContext = inject<KcContext>(KC_CONTEXT);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
    loginResourceInjectorService = inject(LoginResourceInjectorService);

    displayInfo = input(false);
    displayMessage = input(true);
    displayRequiredFields = input(false);
    documentTitle = input<string>();
    bodyClassName = input<string>();

    isReadyToRender$: Observable<boolean>;

    constructor() {
        super();
        this.title.setTitle(
            this.documentTitle() ??
                this.i18n.msgStr("loginTitle", this.kcContext.realm.displayName)
        );
        this.isReadyToRender$ = this.loginResourceInjectorService.injectResource(
            this.doUseDefaultCss
        );
    }

    ngOnInit() {
        this.applyKcIndexClasses();
    }

    private applyKcIndexClasses() {
        const kcClsx = getKcClsx({
            doUseDefaultCss: this.doUseDefaultCss,
            classes: this.classes
        }).kcClsx;
        const kcBodyClass = this.bodyClassName() ?? kcClsx("kcBodyClass");
        const kcHtmlClass = kcClsx("kcHtmlClass");
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
        document.forms["kc-select-try-another-way-form" as never].submit();
    }
}

import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CLASSES, I18N, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { I18n } from 'keycloakify/account/i18n';
import { KcContext } from 'keycloakify/account/KcContext';
import { ClassKey, getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { Observable } from 'rxjs';
import { ComponentReference } from '../classes/component-reference.class';
import { KcClassDirective } from '../directives/kc-class.directive';
import { KcSanitizePipe } from '../pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '../pipes/msg-str.pipe';
import { AccountResourceInjectorService } from '../services/resource-injector.service';

@Component({
  selector: 'kc-account-template',
  templateUrl: './template.component.html',
  standalone: true,
  imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, MsgStrPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ComponentReference,
      useExisting: forwardRef(() => TemplateComponent),
    },
  ],
})
export class TemplateComponent extends ComponentReference implements OnInit {
  i18n = inject<I18n>(I18N);
  renderer = inject(Renderer2);
  meta = inject(Meta);
  title = inject(Title);
  kcContext = inject<KcContext>(KC_CONTEXT);
  override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  override classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
  accountResourceInjectorService = inject(AccountResourceInjectorService);

  active = input<
    'account' | 'password' | 'totp' | 'social' | 'sessions' | 'applications' | 'log' | 'authorization' | undefined
  >(undefined);

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
      classes: this.classes,
    }).kcClsx;
    const kcBodyClass = kcClsx('kcBodyClass');
    const kcHtmlClass = kcClsx('kcHtmlClass');
    const kcBodyClasses = kcBodyClass.split(/\s+/);
    const kcHtmlClasses = kcHtmlClass.split(/\s+/);
    kcBodyClasses.push('admin-console', 'user');
    kcBodyClasses.forEach((klass) => {
      this.renderer.addClass(document.body, klass);
    });
    kcHtmlClasses.forEach((klass) => {
      this.renderer.addClass(document.documentElement, klass);
    });
  }
}

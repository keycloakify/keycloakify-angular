import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CLASSES, I18N, KC_CONTEXT, USE_DEFAULT_CSS } from 'keycloakify-angular';
import { I18n } from 'keycloakify/account/i18n';
import { KcContext } from 'keycloakify/account/KcContext';
import { ClassKey, getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { Observable } from 'rxjs';
import { KcClassDirective } from '../directives/kc-class.directive';
import { KcSanitizePipe } from '../pipes/kc-sanitize.pipe';
import { MsgStrPipe } from '../pipes/msg-str.pipe';
import { AccountResourceInjectorService } from '../services/resource-injector.service';

@Component({
  selector: 'kc-login-template',
  templateUrl: './template.component.html',
  standalone: true,
  imports: [AsyncPipe, KcSanitizePipe, NgTemplateOutlet, KcClassDirective, MsgStrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateComponent implements OnInit {
  i18n = inject<I18n>(I18N);
  renderer = inject(Renderer2);
  meta = inject(Meta);
  title = inject(Title);
  kcContext = inject<KcContext>(KC_CONTEXT);
  doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
  classes = inject<Partial<Record<ClassKey, string>>>(CLASSES);
  accountResourceInjectorService = inject(AccountResourceInjectorService);

  displayInfo = input(false);
  displayMessage = input(true);
  displayRequiredFields = input(false);
  documentTitle = input<string>();
  bodyClassName = input<string>();

  isReadyToRender$: Observable<boolean>;

  constructor() {
    // this.title.setTitle(this.documentTitle() ?? this.i18n.msgStr('loginTitle', this.kcContext.realm.displayName));
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
    const kcBodyClass = this.bodyClassName() ?? kcClsx('kcBodyClass');
    const kcHtmlClass = kcClsx('kcHtmlClass');
    const kcBodyClasses = kcBodyClass.split(/\s+/);
    const kcHtmlClasses = kcHtmlClass.split(/\s+/);
    kcBodyClasses.forEach((klass) => {
      this.renderer.addClass(document.body, klass);
    });
    kcHtmlClasses.forEach((klass) => {
      this.renderer.addClass(document.documentElement, klass);
    });
  }

  tryAnotherWay() {
    document.forms['kc-select-try-another-way-form' as never].submit();
  }
}

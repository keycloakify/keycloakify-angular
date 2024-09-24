import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { KcContext } from 'keycloakify/login/KcContext';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { KC_CONTEXT } from '../providers/keycloakify-angular.providers';
import { Script } from '../models/script.model';

@Injectable({
  providedIn: 'root',
})
export class ResourceInjectorService {
  private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);
  private kcContext: KcContext = inject(KC_CONTEXT);

  injectResource(doUseDefaultCss = true) {
    if (!doUseDefaultCss) {
      this.injectScripts();
      return of(true);
    }
    const stylesheets = [
      `${this.kcContext.url.resourcesCommonPath}/node_modules/@patternfly/patternfly/patternfly.min.css`,
      `${this.kcContext.url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${this.kcContext.url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${this.kcContext.url.resourcesCommonPath}/lib/pficon/pficon.css`,
      `${this.kcContext.url.resourcesPath}/css/login.css`,
    ];

    return forkJoin(stylesheets.map((url) => this.createLink(url))).pipe(
      switchMap(() => {
        this.injectScripts();
        return of(true);
      }),
      catchError((error) => {
        console.error('Error loading styles:', error);
        return of(false);
      }),
    );
  }

  insertAdditionalScripts(scripts: Script[]) {
    scripts.map((script) => this.createScript(script));
  }

  private injectScripts() {
    const scripts: Script[] = [
      {
        type: 'module',
        id: `${this.kcContext.url.resourcesPath}/js/menu-button-links.js`,
        src: `${this.kcContext.url.resourcesPath}/js/menu-button-links.js`,
      },
      ...this.kcContext.scripts.map((script) => ({
        type: 'text/javascript',
        src: script,
        id: script,
      })),
      {
        type: 'module',
        id: 'authenticationSession',
        textContent: `
        import { checkCookiesAndSetTimer } from "${this.kcContext.url.resourcesPath}/js/authChecker.js";
          
        checkCookiesAndSetTimer(
            "${this.kcContext.url.ssoLoginInOtherTabsUrl}"
        );`,
      },
    ];
    this.insertAdditionalScripts(scripts);
  }
  private createLink(url: string): Observable<void> {
    return new Observable<void>((observer) => {
      // check if the style is already injected
      if (Array.from(document.styleSheets).some((s) => s.href?.includes(url))) {
        observer.next();
        observer.complete();
        console.debug(`stylesheet: ${url} already loaded`);
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      link.onload = () => {
        observer.next();
        observer.complete();
      };

      link.onerror = () => {
        observer.error(new Error(`Failed to load stylesheet: ${url}`));
      };

      this.renderer.appendChild(document.head, link);
    });
  }
  private createScript({
    type,
    id,
    src,
    textContent,
  }: {
    type: string;
    id: string;
    src?: string;
    textContent?: string;
  }): void {
    // check if the script is already injected
    if (Array.from(document.scripts).some((s) => s.id?.includes(id))) {
      console.debug(`script: ${src} already injected`);
      return;
    }
    const script = document.createElement('script');
    script.type = type;
    if (src) script.src = src;
    if (textContent) script.textContent = textContent;
    script.id = id;

    this.renderer.appendChild(document.head, script);
  }
}

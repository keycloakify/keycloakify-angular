import { inject, Injectable } from '@angular/core';
import { KC_CONTEXT, ResourceInjectorService, Script } from 'keycloakify-angular';
import { KcContext } from 'keycloakify/account/KcContext';
import { catchError, forkJoin, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountResourceInjectorService {
  private kcContext: KcContext = inject<KcContext>(KC_CONTEXT);
  private resourceInjectorService: ResourceInjectorService = inject(ResourceInjectorService);

  injectResource(doUseDefaultCss = true) {
    if (!doUseDefaultCss) {
      return of(true);
    }
    const stylesheets = [
      `${this.kcContext.url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly.min.css`,
      `${this.kcContext.url.resourcesCommonPath}/node_modules/patternfly/dist/css/patternfly-additions.min.css`,
      `${this.kcContext.url.resourcesPath}/css/account.css`,
    ];

    return forkJoin(stylesheets.map((url) => this.resourceInjectorService.createLink(url))).pipe(
      switchMap(() => of(true)),
      catchError((error) => {
        console.error('Error loading styles:', error);
        return of(false);
      }),
    );
  }

  insertAdditionalScripts(scripts: Script[]) {
    scripts.map((script) => this.resourceInjectorService.createScript(script));
  }
}

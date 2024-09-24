import '@angular/compiler';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideKeycloakifyAngular } from 'keycloakify-angular';
import { getI18n } from './login/i18n';
import { KcPage } from './login/KcPage';

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
import { getKcContextMock } from './login/KcContextMock';

if (import.meta.env.DEV) {
  window.kcContext = getKcContextMock({
    pageId: 'register.ftl',
    overrides: {},
  });
}

if (!window.kcContext) {
  const NoContextComponentPromise = import('./no-context.component').then((c) => c.NoContextComponent);
  NoContextComponentPromise.then((NoContextComponent) => bootstrapApplication(NoContextComponent));
} else {
  KcPage(window.kcContext.pageId).then(
    ({ ComponentBootstrap, doMakeUserConfirmPassword, doUseDefaultCss, classes }) => {
      bootstrapApplication(ComponentBootstrap, {
        providers: [
          provideExperimentalZonelessChangeDetection(),
          provideKeycloakifyAngular({
            classes,
            doMakeUserConfirmPassword,
            doUseDefaultCss,
            getI18n: getI18n,
          }),
        ],
      }).then((appRef) => {
        appRef.components.forEach((componentRef) => {
          if ('classes' in componentRef.instance) {
            componentRef.setInput('classes', classes);
          }
          if ('doUseDefaultCss' in componentRef.instance) {
            componentRef.setInput('doUseDefaultCss', doUseDefaultCss);
          }
        });
      });
    },
  );
}

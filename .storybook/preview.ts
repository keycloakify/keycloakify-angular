/* eslint-disable @typescript-eslint/no-explicit-any */
import '@angular/compiler';

import { provideExperimentalZonelessChangeDetection, Type } from '@angular/core';
import { type Preview } from '@storybook/angular';
import { provideKeycloakifyAngular } from 'keycloakify-angular';
import { LOGIN_THEME_PAGE_IDS } from 'keycloakify/bin/shared/constants';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  beforeEach: async (context) => {
    const pageId = context.globals['pageId'];
    const overrides = context.globals['overrides'];
    let getI18n: any;
    let ComponentReference: any;
    let Component: Type<unknown>;
    if (LOGIN_THEME_PAGE_IDS.includes(pageId)) {
      const { createKcPageStory } = await import('../stories/login/KcPageStory');
      Component = (await createKcPageStory({ pageId, overrides })).ComponentBootstrap;
      getI18n = (await import('../stories/login/i18n')).getI18n;
      ComponentReference = (await import('keycloakify-angular/login')).ComponentReference;
    } else {
      const { createKcPageStory } = await import('../stories/account/KcPageStory');
      Component = (await createKcPageStory({ pageId, overrides })).ComponentBootstrap;
      getI18n = (await import('../stories/account/i18n')).getI18n;
      ComponentReference = (await import('keycloakify-angular/account')).ComponentReference;
    }
    context.globals['Component'] = Component;
    context.globals['getI18n'] = getI18n;
    context.globals['ComponentReference'] = ComponentReference;
  },
  decorators: [
    (_, context) => {
      return {
        props: { Component: context.globals['Component'] },
        applicationConfig: {
          providers: [
            provideExperimentalZonelessChangeDetection(),
            provideKeycloakifyAngular({ getI18n: context.globals['getI18n'] }),
          ],
        },
      };
    },
  ],
};

export default preview;

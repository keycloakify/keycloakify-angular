import { forwardRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideKeycloakifyAngular } from 'keycloakify-angular';
import { ComponentReference } from 'keycloakify-angular/login';
import { getI18n } from '../i18n';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'frontchannel-logout.ftl' });
const FrontchannelLogoutComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof FrontchannelLogoutComponent> = {
  component: FrontchannelLogoutComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideKeycloakifyAngular({
          getI18n: getI18n,
        }),
      ],
    }),
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => FrontchannelLogoutComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

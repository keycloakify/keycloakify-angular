import { forwardRef, provideZoneChangeDetection } from '@angular/core';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import {
  ComponentReference,
  KcClassDirective,
  MsgStrPipe,
  provideKeycloakifyAngular,
  TemplateComponent,
} from 'keycloakify-angular';
import { getI18n } from '../i18n';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'code.ftl' });
const CodeComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof CodeComponent> = {
  component: CodeComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideZoneChangeDetection(),
        provideKeycloakifyAngular({
          getI18n: getI18n,
        }),
      ],
    }),
    moduleMetadata({
      imports: [MsgStrPipe, TemplateComponent, KcClassDirective],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => CodeComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

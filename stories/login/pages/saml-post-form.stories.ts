import { forwardRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideKeycloakifyAngular } from 'keycloakify-angular';
import { ComponentReference } from 'keycloakify-angular/login';
import { getI18n } from '../i18n';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'saml-post-form.ftl' });
const SamlPostFormComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof SamlPostFormComponent> = {
  component: SamlPostFormComponent,
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
          useExisting: forwardRef(() => SamlPostFormComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
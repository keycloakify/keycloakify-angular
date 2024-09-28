import { forwardRef } from '@angular/core';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ComponentReference } from 'keycloakify-angular/login';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'webauthn-authenticate.ftl' });
const WebauthnAuthenticateComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof WebauthnAuthenticateComponent> = {
  component: WebauthnAuthenticateComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => WebauthnAuthenticateComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

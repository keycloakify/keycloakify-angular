import { forwardRef } from '@angular/core';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ComponentReference } from 'keycloakify-angular/login';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'webauthn-register.ftl' });
const WebauthnRegisterComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof WebauthnRegisterComponent> = {
  component: WebauthnRegisterComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => WebauthnRegisterComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

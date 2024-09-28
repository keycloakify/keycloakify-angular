import { forwardRef } from '@angular/core';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ComponentReference } from 'keycloakify-angular/login';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'update-email.ftl' });
const UpdateEmailComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof UpdateEmailComponent> = {
  component: UpdateEmailComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => UpdateEmailComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

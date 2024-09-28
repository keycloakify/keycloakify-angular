import { forwardRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { provideKeycloakifyAngular } from 'keycloakify-angular';
import { ComponentReference, KcClassDirective, MsgStrPipe, TemplateComponent } from 'keycloakify-angular/login';
import { getI18n } from '../i18n';
import { createKcPageStory } from '../KcPageStory';

const { KcPageStory } = createKcPageStory({ pageId: 'delete-account-confirm.ftl' });
const DeleteAccountConfirmComponent = (await KcPageStory({})).ComponentBootstrap;
const meta: Meta<typeof DeleteAccountConfirmComponent> = {
  component: DeleteAccountConfirmComponent,
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
      imports: [MsgStrPipe, TemplateComponent, KcClassDirective],
      providers: [
        {
          provide: ComponentReference,
          useExisting: forwardRef(() => DeleteAccountConfirmComponent),
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

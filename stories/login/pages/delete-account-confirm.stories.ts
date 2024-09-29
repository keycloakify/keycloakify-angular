import { Meta, StoryObj } from '@storybook/angular';
import { DeepPartial } from 'keycloakify/tools/DeepPartial';
import { WrapperComponent } from '../../wrapper-component';
import { KcContext } from '../KcContext';

const meta: Meta<WrapperComponent> = {
  component: WrapperComponent,
};
export default meta;

type Story = StoryObj<WrapperComponent>;

const pageId: KcContext['pageId'] = 'delete-account-confirm.ftl';
const overrides: DeepPartial<Extract<KcContext, { pageId: 'delete-account-confirm.ftl' }>> = {};

export const Default: Story = {
  globals: {
    pageId,
    overrides,
  },
};

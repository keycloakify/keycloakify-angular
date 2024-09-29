import { Meta, StoryObj } from '@storybook/angular';
import { DeepPartial } from 'keycloakify/tools/DeepPartial';
import { WrapperComponent } from '../../wrapper-component';
import { KcContext } from '../KcContext';

const meta: Meta<WrapperComponent> = {
  component: WrapperComponent,
};
export default meta;

type Story = StoryObj<WrapperComponent>;

const pageId: KcContext['pageId'] = 'select-authenticator.ftl';
const overrides: DeepPartial<Extract<KcContext, { pageId: 'select-authenticator.ftl' }>> = {};

export const Default: Story = {
  globals: {
    pageId,
    overrides,
  },
};

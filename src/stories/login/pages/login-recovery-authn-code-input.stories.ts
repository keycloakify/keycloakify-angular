import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-recovery-authn-code-input.ftl',
    component: KcPageStory,
    globals: { pageId: 'login-recovery-authn-code-input.ftl' }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-passkeys-conditional-authenticate.ftl',
    component: KcPageStory,
    globals: { pageId: 'login-passkeys-conditional-authenticate.ftl' }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

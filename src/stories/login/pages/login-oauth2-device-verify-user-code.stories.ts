import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-oauth2-device-verify-user-code.ftl',
    component: KcPageStory,
    globals: { pageId: 'login-oauth2-device-verify-user-code.ftl' }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

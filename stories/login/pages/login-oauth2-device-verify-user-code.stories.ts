import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-oauth2-device-verify-user-code.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: { pageId: 'login-oauth2-device-verify-user-code.ftl' }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-device-verify-user-code.ftl',
    component: KcPageStory,
    decorators: decorators
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

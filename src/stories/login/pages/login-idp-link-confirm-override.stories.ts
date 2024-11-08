import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-idp-link-confirm-override.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'login-idp-link-confirm-override.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

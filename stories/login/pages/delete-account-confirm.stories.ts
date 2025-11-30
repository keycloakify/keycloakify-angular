import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/delete-account-confirm.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'delete-account-confirm.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAIAFlow: Story = {
    globals: {
        kcContext: {
            triggered_from_aia: true,
            url: { loginAction: '/login-action' }
        }
    }
};

export const WithoutAIAFlow: Story = {
    globals: {
        kcContext: {
            triggered_from_aia: false,
            url: { loginAction: '/login-action' }
        }
    }
};

export const WithCustomButtonStyle: Story = {
    globals: {
        kcContext: {
            triggered_from_aia: true,
            url: { loginAction: '/login-action' }
        }
    }
};

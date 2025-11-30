import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-update-password.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-update-password.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithPasswordError: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'password',
                get: () => 'Password must be at least 8 characters long.'
            },
            isAppInitiatedAction: false
        }
    }
};

export const WithPasswordConfirmError: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'password-confirm',
                get: () => 'Passwords do not match.'
            },
            isAppInitiatedAction: false
        }
    }
};

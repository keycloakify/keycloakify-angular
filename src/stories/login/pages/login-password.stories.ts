import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-password.ftl',
    component: KcPageStory,
    globals: { pageId: 'login-password.ftl' }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithPasswordError: Story = {
    globals: {
        overrides: {
            realm: {
                resetPasswordAllowed: true
            },
            url: {
                loginAction: '/mock-login',
                loginResetCredentialsUrl: '/mock-reset-password'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'password',
                get: () => 'Invalid password'
            }
        }
    }
};

export const WithoutResetPasswordOption: Story = {
    globals: {
        overrides: {
            realm: {
                resetPasswordAllowed: false
            },
            url: {
                loginAction: '/mock-login',
                loginResetCredentialsUrl: '/mock-reset-password'
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};

import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-reset-password.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-reset-password.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithEmailAsUsername: Story = {
    globals: {
        kcContext: {
            realm: {
                loginWithEmailAllowed: true,
                registrationEmailAsUsername: true
            }
        }
    }
};

export const WithUsernameError: Story = {
    globals: {
        kcContext: {
            realm: {
                loginWithEmailAllowed: false,
                registrationEmailAsUsername: false,
                duplicateEmailsAllowed: false
            },
            url: {
                loginAction: '/mock-login-action',
                loginUrl: '/mock-login-url'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'username',
                get: () => 'Invalid username'
            },
            auth: {
                attemptedUsername: 'invalid_user'
            }
        }
    }
};

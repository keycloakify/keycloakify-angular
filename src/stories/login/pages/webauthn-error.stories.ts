import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/webauthn-error.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'webauthn-error.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithRetryAvailable: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            isAppInitiatedAction: false,
            message: {
                summary: 'WebAuthn authentication failed. Please try again.',
                type: 'error'
            }
        }
    }
};

export const WithAppInitiatedAction: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            isAppInitiatedAction: true,
            message: {
                summary: 'WebAuthn authentication failed. You can try again or cancel.',
                type: 'error'
            }
        }
    }
};

export const WithJavaScriptDisabled: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            isAppInitiatedAction: false,
            message: {
                summary: 'JavaScript is disabled or not working. Please retry manually.',
                type: 'warning'
            }
        }
    }
};
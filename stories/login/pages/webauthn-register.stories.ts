import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/webauthn-register.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'webauthn-register.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithRetryAvailable: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            isSetRetry: true,
            isAppInitiatedAction: false
        }
    }
};

export const WithErrorDuringRegistration: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            isSetRetry: false,
            isAppInitiatedAction: false,
            message: {
                summary:
                    'An error occurred during WebAuthn registration. Please try again.',
                type: 'error'
            }
        }
    }
};

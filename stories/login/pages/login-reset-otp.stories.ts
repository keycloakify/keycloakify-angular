import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-reset-otp.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-reset-otp.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithoutOtpCredentials: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login'
            },
            configuredOtpCredentials: {
                userOtpCredentials: [],
                selectedCredentialId: undefined
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};

export const WithOtpError: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login'
            },
            configuredOtpCredentials: {
                userOtpCredentials: [
                    { id: 'otp1', userLabel: 'Device 1' },
                    { id: 'otp2', userLabel: 'Device 2' }
                ],
                selectedCredentialId: 'otp1'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'totp',
                get: () => 'Invalid OTP selection'
            }
        }
    }
};

export const WithOnlyOneOtpCredential: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login'
            },
            configuredOtpCredentials: {
                userOtpCredentials: [{ id: 'otp1', userLabel: 'Device 1' }],
                selectedCredentialId: 'otp1'
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};

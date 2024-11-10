import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-otp.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-otp.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const MultipleOtpCredentials: Story = {
    globals: {
        kcContext: {
            otpLogin: {
                userOtpCredentials: [
                    { id: 'credential1', userLabel: 'Device 1' },
                    { id: 'credential2', userLabel: 'Device 2' },
                    { id: 'credential2', userLabel: 'Device 3' },
                    { id: 'credential2', userLabel: 'Device 4' },
                    { id: 'credential2', userLabel: 'Device 5' },
                    { id: 'credential2', userLabel: 'Device 6' }
                ],
                selectedCredentialId: 'credential1'
            },
            url: {
                loginAction: '/login-action'
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
            otpLogin: {
                userOtpCredentials: []
            },
            url: {
                loginAction: '/login-action'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'totp',
                get: () => 'Invalid OTP code'
            }
        }
    }
};

export const NoOtpCredentials: Story = {
    globals: {
        kcContext: {
            otpLogin: {
                userOtpCredentials: []
            },
            url: {
                loginAction: '/login-action'
            },
            messagesPerField: {
                existsError: () => false
            }
        }
    }
};

export const WithErrorAndMultipleOtpCredentials: Story = {
    globals: {
        kcContext: {
            otpLogin: {
                userOtpCredentials: [
                    { id: 'credential1', userLabel: 'Device 1' },
                    { id: 'credential2', userLabel: 'Device 2' }
                ],
                selectedCredentialId: 'credential1'
            },
            url: {
                loginAction: '/login-action'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'totp',
                get: () => 'Invalid OTP code'
            }
        }
    }
};

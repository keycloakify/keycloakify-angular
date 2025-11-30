import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-config-totp.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-config-totp.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithManualSetUp: Story = {
    globals: {
        kcContext: {
            mode: 'manual'
        }
    }
};

export const WithError: Story = {
    globals: {
        kcContext: {
            messagesPerField: {
                get: (fieldName: string) =>
                    fieldName === 'totp' ? 'Invalid TOTP' : undefined,
                exists: (fieldName: string) => fieldName === 'totp',
                existsError: (fieldName: string) => fieldName === 'totp',
                printIfExists: <T>(fieldName: string, x: T) =>
                    fieldName === 'totp' ? x : undefined
            }
        }
    }
};

export const WithAppInitiatedAction: Story = {
    globals: {
        kcContext: {
            isAppInitiatedAction: true
        }
    }
};

export const WithPreFilledUserLabel: Story = {
    globals: {
        kcContext: {
            totp: {
                otpCredentials: [{ userLabel: 'MyDevice' }]
            }
        }
    }
};

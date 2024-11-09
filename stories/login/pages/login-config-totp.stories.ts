import { Meta, StoryObj } from '@storybook/angular';
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
        overrides: {
            mode: 'manual'
        }
    }
};

export const WithError: Story = {
    globals: {
        overrides: {
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
        overrides: {
            isAppInitiatedAction: true
        }
    }
};

export const WithPreFilledUserLabel: Story = {
    globals: {
        overrides: {
            totp: {
                otpCredentials: [{ userLabel: 'MyDevice' }]
            }
        }
    }
};

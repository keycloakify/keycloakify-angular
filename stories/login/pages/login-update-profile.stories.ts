import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-update-profile.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-update-profile.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithProfileError: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            messagesPerField: {
                existsError: (field: string) => field === 'email',
                get: () => 'Invalid email format'
            },
            isAppInitiatedAction: false
        }
    }
};

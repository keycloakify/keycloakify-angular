import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-update-profile.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'login-update-profile.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithProfileError: Story = {
    globals: {
        overrides: {
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

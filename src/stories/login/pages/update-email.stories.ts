import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/update-email.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'update-email.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAppInitiatedAction: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            messagesPerField: {
                exists: () => false
            },
            isAppInitiatedAction: true
        }
    }
};

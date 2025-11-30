import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/update-email.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'update-email.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAppInitiatedAction: Story = {
    globals: {
        kcContext: {
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

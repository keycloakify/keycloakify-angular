import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-page-expired.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-page-expired.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithErrorMessage: Story = {
    globals: {
        overrides: {
            url: {
                loginRestartFlowUrl: '/mock-restart-flow',
                loginAction: '/mock-continue-login'
            },
            message: {
                type: 'error',
                summary: 'An error occurred while processing your session.'
            }
        }
    }
};

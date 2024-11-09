import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-recovery-authn-code-config.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-recovery-authn-code-config.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithErrorDuringCodeGeneration: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            message: {
                summary:
                    'An error occurred during recovery code generation. Please try again.',
                type: 'error'
            }
        }
    }
};

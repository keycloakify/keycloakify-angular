import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-username.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-username.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithEmailAsUsername: Story = {
    globals: {
        kcContext: {
            realm: {
                loginWithEmailAllowed: true,
                registrationEmailAsUsername: true
            }
        }
    }
};

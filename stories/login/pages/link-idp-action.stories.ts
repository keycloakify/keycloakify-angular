import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/link-idp-action.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'link-idp-action.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {
    globals: {
        kcContext: {
            idpDisplayName: 'GitHub',
            url: { loginAction: '/mock-login-action' }
        }
    }
};

import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-passkeys-conditional-authenticate.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-passkeys-conditional-authenticate.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

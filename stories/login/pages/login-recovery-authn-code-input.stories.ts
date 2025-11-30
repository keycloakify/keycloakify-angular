import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-recovery-authn-code-input.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-recovery-authn-code-input.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

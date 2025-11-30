import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/saml-post-form.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'saml-post-form.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

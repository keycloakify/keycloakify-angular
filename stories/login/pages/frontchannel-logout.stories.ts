import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/frontchannel-logout.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'frontchannel-logout.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithoutRedirectUrl: Story = {
    globals: {
        kcContext: {
            logout: {
                clients: []
            }
        }
    }
};

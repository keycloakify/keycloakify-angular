import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/frontchannel-logout.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'frontchannel-logout.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithoutRedirectUrl: Story = {
    globals: {
        overrides: {
            logout: {
                clients: []
            }
        }
    }
};

import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/code.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'code.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithErrorCode: Story = {
    globals: {
        kcContext: {
            code: {
                success: false,
                error: 'Failed to generate code'
            }
        }
    }
};
export const WithFrenchLanguage: Story = {
    globals: {
        kcContext: {
            locale: {
                currentLanguageTag: 'fr'
            },
            code: {
                success: true,
                code: 'XYZ789'
            }
        }
    }
};

export const WithHtmlErrorMessage: Story = {
    globals: {
        kcContext: {
            code: {
                success: false,
                error: "Something went wrong. <a href='https://example.com'>Try again</a>"
            }
        }
    }
};

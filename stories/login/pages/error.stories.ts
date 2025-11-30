import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/error.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'error.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAnotherMessage: Story = {
    globals: {
        kcContext: {
            message: { summary: 'With another error message' }
        }
    }
};

export const WithHtmlErrorMessage: Story = {
    globals: {
        kcContext: {
            message: {
                summary:
                    "<strong>Error:</strong> Something went wrong. <a href='https://example.com'>Go back</a>"
            }
        }
    }
};

export const FrenchError: Story = {
    globals: {
        kcContext: {
            locale: { currentLanguageTag: 'fr' },
            message: { summary: "Une erreur s'est produite" }
        }
    }
};

export const WithSkipLink: Story = {
    globals: {
        kcContext: {
            message: { summary: 'An error occurred' },
            skipLink: true,
            client: {
                baseUrl: 'https://example.com'
            }
        }
    }
};

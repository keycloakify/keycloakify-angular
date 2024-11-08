import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/error.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'error.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithAnotherMessage: Story = {
    globals: {
        overrides: {
            message: { summary: 'With another error message' }
        }
    }
};

export const WithHtmlErrorMessage: Story = {
    globals: {
        overrides: {
            message: {
                summary:
                    "<strong>Error:</strong> Something went wrong. <a href='https://example.com'>Go back</a>"
            }
        }
    }
};

export const FrenchError: Story = {
    globals: {
        overrides: {
            locale: { currentLanguageTag: 'fr' },
            message: { summary: "Une erreur s'est produite" }
        }
    }
};

export const WithSkipLink: Story = {
    globals: {
        overrides: {
            message: { summary: 'An error occurred' },
            skipLink: true,
            client: {
                baseUrl: 'https://example.com'
            }
        }
    }
};

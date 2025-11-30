import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const mockKcContext = {
    url: {
        oauthAction: '/oauth-action'
    },
    oauth: {
        clientScopesRequested: [
            { consentScreenText: 'Scope1', dynamicScopeParameter: 'dynamicScope1' },
            { consentScreenText: 'Scope2' }
        ],
        code: 'mockCode'
    },
    client: {
        attributes: {
            policyUri: 'https://twitter.com/en/tos',
            tosUri: 'https://twitter.com/en/privacy'
        },
        name: 'Twitter',
        clientId: 'twitter-client-id'
    }
};

const meta: Meta<KcPageStory> = {
    title: 'login/login-oauth-grant.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-oauth-grant.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {
    globals: {
        kcContext: mockKcContext
    }
};

export const WithoutScopes: Story = {
    globals: {
        kcContext: {
            ...mockKcContext,
            oauth: {
                ...mockKcContext.oauth,
                clientScopesRequested: []
            }
        }
    }
};

export const WithFormSubmissionError: Story = {
    globals: {
        kcContext: {
            ...mockKcContext,
            url: {
                oauthAction: '/error'
            },
            message: {
                type: 'error',
                summary: 'An error occurred during form submission.'
            }
        }
    }
};

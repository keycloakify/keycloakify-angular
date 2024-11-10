import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

// Mock kcContext to avoid errors
const mockKcContext = {
    url: {
        loginAction: '/login-action'
    },
    idpAlias: 'mockIdpAlias',
    brokerContext: {
        username: 'mockUser'
    },
    realm: {
        displayName: 'MockRealm'
    }
};

const meta: Meta<KcPageStory> = {
    title: 'login/login-idp-link-confirm.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-idp-link-confirm.ftl',
        overrides: {
            kcContext: mockKcContext
        }
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

/**
 * Default:
 * - Purpose: Tests the default behavior with mock data.
 * - Scenario: The component renders with a mocked identity provider alias (`mockIdpAlias`), a default broker username (`mockUser`), and a default realm name (`MockRealm`).
 * - Key Aspect: Ensures the default behavior of the component with typical kcContext values.
 */
export const Default: Story = {};

/**
 * WithIdpAlias:
 * - Purpose: Tests behavior when the idpAlias is set to "Google".
 * - Scenario: Simulates the component being used with a Google identity provider, showing the username "john.doe" and realm "MyRealm".
 * - Key Aspect: Ensures the correct identity provider alias ("Google") and broker context (user info) are displayed in the email linking instructions.
 */
export const WithIdpAlias: Story = {
    globals: {
        overrides: {
            ...mockKcContext,
            idpAlias: 'Google',
            brokerContext: {
                username: 'john.doe'
            },
            realm: {
                displayName: 'MyRealm'
            }
        }
    }
};

/**
 * WithCustomRealmDisplayName:
 * - Purpose: Tests behavior when the realm display name is customized.
 * - Scenario: Simulates the component with a Facebook identity provider, a broker username "jane.doe", and a custom realm name "CustomRealm".
 * - Key Aspect: Ensures that custom realm display names are rendered correctly alongside the idpAlias and broker context.
 */
export const WithCustomRealmDisplayName: Story = {
    globals: {
        overrides: {
            ...mockKcContext,
            idpAlias: 'Facebook',
            brokerContext: {
                username: 'jane.doe'
            },
            realm: {
                displayName: 'CUSTOM REALM DISPLAY NAME'
            }
        }
    }
};

/**
 * WithFormSubmissionError:
 * - Purpose: Tests how the component handles form submission errors.
 * - Scenario: Simulates a form submission error by setting the login action URL to `/error` and displays an error message.
 * - Key Aspect: Verifies that the component can display error messages during form submission failure, ensuring proper error handling.
 */
export const WithFormSubmissionError: Story = {
    globals: {
        overrides: {
            ...mockKcContext,
            url: {
                loginAction: '/error'
            },
            message: {
                type: 'error',
                summary: 'An error occurred during form submission.'
            }
        }
    }
};

import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login-x509-info.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login-x509-info.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

/**
 * WithoutUserEnabled:
 * - Purpose: Tests when the user is not enabled to log in via x509.
 * - Scenario: The component renders the certificate details but does not provide the option to log in or cancel.
 * - Key Aspect: Ensures that the login buttons are not displayed when the user is not enabled.
 */
export const WithoutUserEnabled: Story = {
    globals: {
        overrides: {
            url: {
                loginAction: '/mock-login-action'
            },
            x509: {
                formData: {
                    subjectDN: 'CN=John Doe, OU=Example Org, O=Example Inc, C=US',
                    username: 'johndoe',
                    isUserEnabled: false // User not enabled for login
                }
            }
        }
    }
};

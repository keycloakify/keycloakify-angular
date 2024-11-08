import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/delete-credential.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'delete-credential.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithCustomCredentialLabel: Story = {
    globals: {
        overrides: {
            credentialLabel: 'Test Credential',
            url: { loginAction: '/login-action' }
        }
    }
};

export const WithSuccessMessage: Story = {
    globals: {
        overrides: {
            message: {
                type: 'success',
                summary: 'Credential has been successfully deleted.'
            }
        }
    }
};

export const WithErrorMessage: Story = {
    globals: {
        overrides: {
            message: {
                type: 'error',
                summary: 'Failed to delete the credential. Please try again.'
            }
        }
    }
};

export const WithDisabledDeleteButton: Story = {
    globals: {
        overrides: {
            isDeleteButtonDisabled: true,
            credentialLabel: 'Non-deletable Credential'
        }
    }
};

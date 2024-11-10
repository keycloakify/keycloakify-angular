import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/delete-credential.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'delete-credential.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithCustomCredentialLabel: Story = {
    globals: {
        kcContext: {
            credentialLabel: 'Test Credential',
            url: { loginAction: '/login-action' }
        }
    }
};

export const WithSuccessMessage: Story = {
    globals: {
        kcContext: {
            message: {
                type: 'success',
                summary: 'Credential has been successfully deleted.'
            }
        }
    }
};

export const WithErrorMessage: Story = {
    globals: {
        kcContext: {
            message: {
                type: 'error',
                summary: 'Failed to delete the credential. Please try again.'
            }
        }
    }
};

export const WithDisabledDeleteButton: Story = {
    globals: {
        kcContext: {
            isDeleteButtonDisabled: true,
            credentialLabel: 'Non-deletable Credential'
        }
    }
};

import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/idp-review-user-profile.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'idp-review-user-profile.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithFormValidationErrors: Story = {
    globals: {
        overrides: {
            messagesPerField: {
                existsError: (fieldName: string) =>
                    ['email', 'firstName'].includes(fieldName),
                get: (fieldName: string) => {
                    if (fieldName === 'email') return 'Invalid email format.';
                    if (fieldName === 'firstName') return 'First name is required.';
                    return '';
                }
            }
        }
    }
};

export const WithReadOnlyFields: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    email: { value: 'jane.doe@example.com', readOnly: true },
                    firstName: { value: 'Jane', readOnly: false }
                }
            }
        }
    }
};

export const WithPrefilledFormFields: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    firstName: { value: 'Jane' },
                    lastName: { value: 'Doe' },
                    email: { value: 'jane.doe@example.com' }
                }
            }
        }
    }
};

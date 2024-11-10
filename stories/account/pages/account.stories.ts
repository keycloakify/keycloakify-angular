import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/account.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'account.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const UsernameNotEditable: Story = {
    globals: {
        kcContext: {
            account: {
                username: 'john_doe',
                email: 'john.doe@gmail.com',
                firstName: 'John',
                lastName: 'Doe'
            },
            realm: {
                registrationEmailAsUsername: false,
                editUsernameAllowed: false
            },
            referrer: {
                url: '/home'
            },
            url: {
                accountUrl: '/account'
            },
            messagesPerField: {
                printIfExists: () => ''
            },
            stateChecker: 'state-checker'
        }
    }
};

export const WithValidationErrors: Story = {
    globals: {
        kcContext: {
            account: {
                username: 'john_doe',
                email: '',
                firstName: '',
                lastName: 'Doe'
            },
            realm: {
                registrationEmailAsUsername: false,
                editUsernameAllowed: true
            },
            referrer: {
                url: '/home'
            },
            url: {
                accountUrl: '/account'
            },
            messagesPerField: {
                printIfExists: (field: string) =>
                    field === 'email' || field === 'firstName' ? 'has-error' : ''
            },
            stateChecker: 'state-checker'
        }
    }
};

export const EmailAsUsername: Story = {
    globals: {
        kcContext: {
            account: {
                email: 'john.doe@gmail.com',
                firstName: 'John',
                lastName: 'Doe'
            },
            realm: {
                registrationEmailAsUsername: true
            },
            referrer: {
                url: '/home'
            },
            url: {
                accountUrl: '/account'
            },
            messagesPerField: {
                printIfExists: () => ''
            },
            stateChecker: 'state-checker'
        }
    }
};

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

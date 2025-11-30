import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'login.ftl'
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidCredential: Story = {
    globals: {
        kcContext: {
            login: {
                username: 'johndoe'
            },
            messagesPerField: {
                existsError: (fieldName: string, ...otherFieldNames: string[]) => {
                    const fieldNames = [fieldName, ...otherFieldNames];
                    return (
                        fieldNames.includes('username') || fieldNames.includes('password')
                    );
                },
                get: (fieldName: string) => {
                    return fieldName === 'username' || fieldName === 'password'
                        ? 'Invalid username or password.'
                        : '';
                }
            }
        }
    }
};

export const WithoutRegistration: Story = {
    globals: {
        kcContext: {
            realm: { registrationAllowed: false }
        }
    }
};

export const WithoutRememberMe: Story = {
    globals: {
        kcContext: {
            realm: { rememberMe: false }
        }
    }
};

export const WithoutPasswordReset: Story = {
    globals: {
        kcContext: {
            realm: { resetPasswordAllowed: false }
        }
    }
};

export const WithEmailAsUsername: Story = {
    globals: {
        kcContext: {
            realm: { loginWithEmailAllowed: false }
        }
    }
};

export const WithPresetUsername: Story = {
    globals: {
        kcContext: {
            login: { username: 'max.mustermann@mail.com' }
        }
    }
};

export const WithImmutablePresetUsername: Story = {
    globals: {
        kcContext: {
            auth: {
                attemptedUsername: 'max.mustermann@mail.com',
                showUsername: true
            },
            usernameHidden: true,
            message: {
                type: 'info',
                summary: 'Please re-authenticate to continue'
            }
        }
    }
};

export const WithSocialProviders: Story = {
    globals: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: 'google',
                        alias: 'google',
                        providerId: 'google',
                        displayName: 'Google',
                        iconClasses: 'fa fa-google'
                    },
                    {
                        loginUrl: 'microsoft',
                        alias: 'microsoft',
                        providerId: 'microsoft',
                        displayName: 'Microsoft',
                        iconClasses: 'fa fa-windows'
                    },
                    {
                        loginUrl: 'facebook',
                        alias: 'facebook',
                        providerId: 'facebook',
                        displayName: 'Facebook',
                        iconClasses: 'fa fa-facebook'
                    },
                    {
                        loginUrl: 'github',
                        alias: 'github',
                        providerId: 'github',
                        displayName: 'Github',
                        iconClasses: 'fa fa-github'
                    }
                ]
            }
        }
    }
};

export const WithoutPasswordField: Story = {
    globals: {
        kcContext: {
            realm: { password: false }
        }
    }
};

export const WithErrorMessage: Story = {
    globals: {
        kcContext: {
            message: {
                summary:
                    'The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.',
                type: 'error'
            }
        }
    }
};

export const WithOneSocialProvider: Story = {
    globals: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: 'google',
                        alias: 'google',
                        providerId: 'google',
                        displayName: 'Google',
                        iconClasses: 'fa fa-google'
                    }
                ]
            }
        }
    }
};

export const WithTwoSocialProviders: Story = {
    globals: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: 'google',
                        alias: 'google',
                        providerId: 'google',
                        displayName: 'Google',
                        iconClasses: 'fa fa-google'
                    },
                    {
                        loginUrl: 'microsoft',
                        alias: 'microsoft',
                        providerId: 'microsoft',
                        displayName: 'Microsoft',
                        iconClasses: 'fa fa-windows'
                    }
                ]
            }
        }
    }
};

export const WithMoreThanTwoSocialProviders: Story = {
    globals: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: 'google',
                        alias: 'google',
                        providerId: 'google',
                        displayName: 'Google',
                        iconClasses: 'fa fa-google'
                    },
                    {
                        loginUrl: 'microsoft',
                        alias: 'microsoft',
                        providerId: 'microsoft',
                        displayName: 'Microsoft',
                        iconClasses: 'fa fa-windows'
                    },
                    {
                        loginUrl: 'facebook',
                        alias: 'facebook',
                        providerId: 'facebook',
                        displayName: 'Facebook',
                        iconClasses: 'fa fa-facebook'
                    },
                    {
                        loginUrl: 'twitter',
                        alias: 'twitter',
                        providerId: 'twitter',
                        displayName: 'Twitter',
                        iconClasses: 'fa fa-twitter'
                    }
                ]
            }
        }
    }
};

export const WithSocialProvidersAndWithoutRememberMe: Story = {
    globals: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: [
                    {
                        loginUrl: 'google',
                        alias: 'google',
                        providerId: 'google',
                        displayName: 'Google',
                        iconClasses: 'fa fa-google'
                    }
                ]
            },
            realm: { rememberMe: false }
        }
    }
};

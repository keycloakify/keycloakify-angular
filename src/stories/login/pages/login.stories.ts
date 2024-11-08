import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/login.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'login.ftl',
        overrides: {}
    }
};

export default meta;
type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithInvalidCredential: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
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
                    return ['username', 'password'].includes(fieldName)
                        ? 'Invalid username or password.'
                        : '';
                }
            }
        }
    }
};

export const WithoutRegistration: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            realm: { registrationAllowed: false }
        }
    }
};

export const WithoutRememberMe: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            realm: { rememberMe: false }
        }
    }
};

export const WithoutPasswordReset: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            realm: { resetPasswordAllowed: false }
        }
    }
};

export const WithEmailAsUsername: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            realm: { loginWithEmailAllowed: false }
        }
    }
};

export const WithPresetUsername: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            login: { username: 'max.mustermann@mail.com' }
        }
    }
};

export const WithImmutablePresetUsername: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
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
        pageId: 'login.ftl',
        overrides: {
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
                        loginUrl: 'instagram',
                        alias: 'instagram',
                        providerId: 'instagram',
                        displayName: 'Instagram',
                        iconClasses: 'fa fa-instagram'
                    },
                    {
                        loginUrl: 'twitter',
                        alias: 'twitter',
                        providerId: 'twitter',
                        displayName: 'Twitter',
                        iconClasses: 'fa fa-twitter'
                    },
                    {
                        loginUrl: 'linkedin',
                        alias: 'linkedin',
                        providerId: 'linkedin',
                        displayName: 'LinkedIn',
                        iconClasses: 'fa fa-linkedin'
                    }
                ]
            }
        }
    }
};

export const WithoutPasswordField: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            realm: { password: false }
        }
    }
};

export const WithErrorMessage: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
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
        pageId: 'login.ftl',
        overrides: {
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
        pageId: 'login.ftl',
        overrides: {
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

export const WithNoSocialProviders: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
            social: {
                displayInfo: true,
                providers: []
            }
        }
    }
};

export const WithMoreThanTwoSocialProviders: Story = {
    globals: {
        pageId: 'login.ftl',
        overrides: {
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
        pageId: 'login.ftl',
        overrides: {
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

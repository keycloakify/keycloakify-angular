import type { Meta, StoryObj } from '@storybook/angular';
import { KcPageStoryComponent } from '../kc-page-story.component'; // Assuming this is the Angular component

export const KcActionsData = {};

const meta: Meta<KcPageStoryComponent> = {
    title: 'login/login.ftl',
    component: KcPageStoryComponent
};

export default meta;

type Story = StoryObj<KcPageStoryComponent>;

export const Default: Story = {
    args: {
        // No specific args, default rendering of the component
    }
};

export const WithInvalidCredential: Story = {
    args: {
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
                    if (fieldName === 'username' || fieldName === 'password') {
                        return 'Invalid username or password.';
                    }
                    return '';
                }
            }
        }
    }
};

export const WithoutRegistration: Story = {
    args: {
        kcContext: {
            realm: { registrationAllowed: false }
        }
    }
};

export const WithoutRememberMe: Story = {
    args: {
        kcContext: {
            realm: { rememberMe: false }
        }
    }
};

export const WithoutPasswordReset: Story = {
    args: {
        kcContext: {
            realm: { resetPasswordAllowed: false }
        }
    }
};

export const WithEmailAsUsername: Story = {
    args: {
        kcContext: {
            realm: { loginWithEmailAllowed: false }
        }
    }
};

export const WithPresetUsername: Story = {
    args: {
        kcContext: {
            login: { username: 'max.mustermann@mail.com' }
        }
    }
};

export const WithImmutablePresetUsername: Story = {
    args: {
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
    args: {
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
                    // Add other providers as needed
                ]
            }
        }
    }
};

export const WithoutPasswordField: Story = {
    args: {
        kcContext: {
            realm: { password: false }
        }
    }
};

export const WithErrorMessage: Story = {
    args: {
        kcContext: {
            message: {
                summary:
                    'The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.',
                type: 'error'
            }
        }
    }
};

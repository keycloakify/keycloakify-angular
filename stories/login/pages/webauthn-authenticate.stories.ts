import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'login/webauthn-authenticate.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'webauthn-authenticate.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithMultipleAuthenticators: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            authenticators: {
                authenticators: [
                    {
                        credentialId: 'authenticator-1',
                        label: 'Security Key 1',
                        transports: {
                            iconClass: 'kcAuthenticatorUsbIcon',
                            displayNameProperties: ['USB']
                        },
                        createdAt: '2023-01-01'
                    },
                    {
                        credentialId: 'authenticator-2',
                        label: 'Security Key 2',
                        transports: {
                            iconClass: 'kcAuthenticatorNfcIcon',
                            displayNameProperties: ['NFC']
                        },
                        createdAt: '2023-02-01'
                    }
                ]
            },
            shouldDisplayAuthenticators: true
        }
    }
};

export const WithSingleAuthenticator: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            authenticators: {
                authenticators: [
                    {
                        credentialId: 'authenticator-1',
                        label: 'My Security Key',
                        transports: {
                            iconClass: 'kcAuthenticatorUsbIcon',
                            displayNameProperties: ['USB']
                        },
                        createdAt: '2023-01-01'
                    }
                ]
            },
            shouldDisplayAuthenticators: true
        }
    }
};

export const WithErrorDuringAuthentication: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            authenticators: {
                authenticators: [
                    {
                        credentialId: 'authenticator-1',
                        label: 'My Security Key',
                        transports: {
                            iconClass: 'kcAuthenticatorUsbIcon',
                            displayNameProperties: ['USB']
                        },
                        createdAt: '2023-01-01'
                    }
                ]
            },
            shouldDisplayAuthenticators: true,
            message: {
                summary: 'An error occurred during WebAuthn authentication.',
                type: 'error'
            }
        }
    }
};

export const WithJavaScriptDisabled: Story = {
    globals: {
        kcContext: {
            url: {
                loginAction: '/mock-login-action'
            },
            authenticators: {
                authenticators: [
                    {
                        credentialId: 'authenticator-1',
                        label: 'My Security Key',
                        transports: {
                            iconClass: 'kcAuthenticatorUsbIcon',
                            displayNameProperties: ['USB']
                        },
                        createdAt: '2023-01-01'
                    }
                ]
            },
            shouldDisplayAuthenticators: true
        }
    }
};

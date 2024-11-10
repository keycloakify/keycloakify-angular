import { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/applications.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'applications.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {
    globals: {
        overrides: {
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [
                            {
                                name: 'realmRoleName1',
                                description: 'realm role description 1'
                            },
                            {
                                name: 'realmRoleName2',
                                description: 'realm role description 2'
                            }
                        ],
                        resourceRolesAvailable: {
                            resource1: [
                                {
                                    roleName: 'Resource Role Name 1',
                                    roleDescription: 'Resource role 1 description',
                                    clientName: 'Client Name 1',
                                    clientId: 'client1'
                                }
                            ],
                            resource2: [
                                {
                                    roleName: 'Resource Role Name 2',
                                    clientName: 'Client Name 1',
                                    clientId: 'client1'
                                }
                            ]
                        },
                        additionalGrants: ['grant1', 'grant2'],
                        clientScopesGranted: ['scope1', 'scope2'],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: true
                        }
                    },
                    {
                        realmRolesAvailable: [{ name: 'Realm Role Name 1' }],
                        resourceRolesAvailable: {},
                        additionalGrants: [],
                        clientScopesGranted: [],
                        effectiveUrl: '#',
                        client: { clientId: 'application2', name: 'Application 2' }
                    }
                ]
            }
        }
    }
};

export const NoAvailableRolesOrGrants: Story = {
    globals: {
        overrides: {
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [],
                        resourceRolesAvailable: {},
                        additionalGrants: [],
                        clientScopesGranted: [],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: true
                        }
                    }
                ]
            }
        }
    }
};

export const ConsentNotRequired: Story = {
    globals: {
        overrides: {
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [],
                        resourceRolesAvailable: {},
                        additionalGrants: [],
                        clientScopesGranted: [],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: false
                        }
                    }
                ]
            }
        }
    }
};

export const NoRolesButConsentRequired: Story = {
    globals: {
        overrides: {
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [],
                        resourceRolesAvailable: {},
                        additionalGrants: [],
                        clientScopesGranted: ['scope1', 'scope2'],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: true
                        }
                    }
                ]
            }
        }
    }
};

export const OnlyResourceRolesAvailable: Story = {
    globals: {
        overrides: {
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [],
                        resourceRolesAvailable: {
                            resource1: [
                                {
                                    roleName: 'Resource Role Name 1',
                                    roleDescription: 'Resource role 1 description',
                                    clientName: 'Client Name 1',
                                    clientId: 'client1'
                                }
                            ]
                        },
                        additionalGrants: [],
                        clientScopesGranted: [],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: true
                        }
                    }
                ]
            }
        }
    }
};

export const NoAdditionalGrants: Story = {
    globals: {
        overrides: {
            pageId: 'applications.ftl',
            applications: {
                applications: [
                    {
                        realmRolesAvailable: [{ name: 'Realm Role Name 1' }],
                        resourceRolesAvailable: {},
                        additionalGrants: [],
                        clientScopesGranted: [],
                        effectiveUrl: '#',
                        client: {
                            clientId: 'application1',
                            name: 'Application 1',
                            consentRequired: true
                        }
                    }
                ]
            }
        }
    }
};

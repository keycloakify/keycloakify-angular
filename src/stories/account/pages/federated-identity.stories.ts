import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/federatedIdentity.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'federatedIdentity.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const NotConnected: Story = {
    globals: {
        overrides: {
            federatedIdentity: {
                identities: [
                    {
                        providerId: 'google',
                        displayName: 'keycloak-oidc',
                        connected: false
                    }
                ],
                removeLinkPossible: true
            }
        }
    }
};

export const RemoveLinkNotPossible: Story = {
    globals: {
        overrides: {
            federatedIdentity: {
                identities: [
                    {
                        providerId: 'google',
                        displayName: 'Google',
                        userName: 'john.doe@gmail.com',
                        connected: true
                    }
                ],
                removeLinkPossible: false
            },
            stateChecker: '1234',
            url: {
                socialUrl: '/social'
            }
        }
    }
};

export const AddLinkForUnconnectedIdentity: Story = {
    globals: {
        overrides: {
            federatedIdentity: {
                identities: [
                    {
                        providerId: 'github',
                        displayName: 'GitHub',
                        userName: '',
                        connected: false
                    }
                ],
                removeLinkPossible: true
            },
            stateChecker: '1234',
            url: {
                socialUrl: '/social'
            }
        }
    }
};

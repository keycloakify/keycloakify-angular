import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/federatedIdentity.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'federatedIdentity.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const NotConnected: Story = {
    globals: {
        kcContext: {
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
        kcContext: {
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
        kcContext: {
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

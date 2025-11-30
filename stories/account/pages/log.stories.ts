import type { Meta, StoryObj } from '@storybook/angular';
import { decorators, KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/log.ftl',
    component: KcPageStory,
    decorators: decorators,
    globals: {
        pageId: 'log.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {
    globals: {
        kcContext: {
            log: {
                events: [
                    {
                        date: '2024-04-26T12:29:08Z',
                        ipAddress: '127.0.0.1',
                        client: 'keycloakify-frontend',
                        details: [
                            { key: 'auth_method', value: 'openid-connect' },
                            { key: 'username', value: 'john.doe' }
                        ],
                        event: 'login'
                    },
                    {
                        date: '2024-04-26T12:10:56Z',
                        ipAddress: '127.0.0.1',
                        client: 'keycloakify-frontend',
                        details: [
                            { key: 'auth_method', value: 'openid-connect' },
                            { key: 'username', value: 'john.doe' }
                        ],
                        event: 'login'
                    }
                    // Add more log events as needed
                ]
            }
        }
    }
};

export const LogsMissingDetails: Story = {
    globals: {
        kcContext: {
            log: {
                events: [
                    {
                        date: '2024-04-26T12:29:08Z',
                        ipAddress: '127.0.0.1',
                        client: '',
                        details: [],
                        event: 'login'
                    }
                ]
            }
        }
    }
};

export const SingleLogEntry: Story = {
    globals: {
        kcContext: {
            log: {
                events: [
                    {
                        date: '2024-04-26T12:29:08Z',
                        ipAddress: '127.0.0.1',
                        client: 'keycloakify-frontend',
                        details: [
                            { key: 'auth_method', value: 'openid-connect' },
                            { key: 'username', value: 'john.doe' }
                        ],
                        event: 'login'
                    }
                ]
            }
        }
    }
};

export const LogsWithLongDetails: Story = {
    globals: {
        kcContext: {
            log: {
                events: [
                    {
                        date: '2024-04-26T12:29:08Z',
                        ipAddress: '127.0.0.1',
                        client: 'keycloakify-frontend',
                        details: [
                            { key: 'auth_method', value: 'openid-connect' },
                            { key: 'username', value: 'john.doe' },
                            {
                                key: 'session_duration',
                                value: '2 hours 30 minutes 45 seconds'
                            },
                            { key: 'location', value: 'Windsor, Ontario, Canada' },
                            {
                                key: 'user_agent',
                                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                            }
                        ],
                        event: 'login'
                    }
                ]
            }
        }
    }
};

export const EmptyClientField: Story = {
    globals: {
        kcContext: {
            log: {
                events: [
                    {
                        date: '2024-04-26T12:29:08Z',
                        ipAddress: '127.0.0.1',
                        client: '', // Empty client field
                        details: [
                            { key: 'auth_method', value: 'openid-connect' },
                            { key: 'username', value: 'john.doe' }
                        ],
                        event: 'login'
                    }
                ]
            }
        }
    }
};

export const NoLogsAvailable: Story = {
    globals: {
        kcContext: {
            log: {
                events: [] // No log events
            }
        }
    }
};

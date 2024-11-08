import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';
import { Attribute } from 'keycloakify/login';

const meta: Meta<KcPageStory> = {
    title: 'login/register.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'register.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {};

export const WithEmailAlreadyExists: Story = {
    globals: {
        overrides: {
            messagesPerField: {
                existsError: (fieldName: string, ...otherFieldNames: string[]) =>
                    [fieldName, ...otherFieldNames].includes('email'),
                get: (fieldName: string) =>
                    fieldName === 'email' ? 'Email already exists.' : ''
            }
        }
    }
};

export const WithRestrictedToMITStudents: Story = {
    globals: {
        overrides: {
            'x-keycloakify': {
                messages: {
                    'profile.attributes.email.inputHelperTextBefore':
                        'Please use your MIT or Berkeley email.',
                    'profile.attributes.email.pattern.error':
                        'This is not an MIT (<strong>@mit.edu</strong>) nor a Berkeley (<strong>@berkeley.edu</strong>) email.'
                }
            }
        }
    }
};

export const WithFavoritePet: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    favoritePet: {
                        name: 'favorite-pet',
                        displayName: '${profile.attributes.favoritePet}',
                        validators: {
                            options: {
                                options: ['cat', 'dog', 'fish']
                            }
                        },
                        annotations: {
                            inputOptionLabelsI18nPrefix:
                                'profile.attributes.favoritePet.options'
                        },
                        required: false,
                        readOnly: false
                    } satisfies Attribute
                }
            },
            'x-keycloakify': {
                messages: {
                    'profile.attributes.favoritePet': 'Favorite Pet',
                    'profile.attributes.favoritePet.options.cat': 'Fluffy Cat',
                    'profile.attributes.favoritePet.options.dog': 'Loyal Dog',
                    'profile.attributes.favoritePet.options.fish': 'Peaceful Fish'
                }
            }
        }
    }
};

export const WithNewsletter: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    newsletter: {
                        name: 'newsletter',
                        displayName: 'Sign up to the newsletter',
                        validators: {
                            options: {
                                options: ['yes']
                            }
                        },
                        annotations: {
                            inputOptionLabels: {
                                yes: 'I want my email inbox filled with spam'
                            },
                            inputType: 'multiselect-checkboxes'
                        },
                        required: false,
                        readOnly: false
                    } satisfies Attribute
                }
            }
        }
    }
};

export const WithEmailAsUsername: Story = {
    globals: {
        overrides: {
            realm: {
                registrationEmailAsUsername: true
            },
            profile: {
                attributesByName: {
                    username: undefined
                }
            }
        }
    }
};

export const WithRecaptcha: Story = {
    globals: {
        overrides: {
            scripts: ['https://www.google.com/recaptcha/api.js?hl=en'],
            recaptchaRequired: true,
            recaptchaSiteKey: '6LfQHvApAAAAAE73SYTd5vS0lB1Xr7zdiQ-6iBVa'
        }
    }
};

export const WithRecaptchaFrench: Story = {
    globals: {
        overrides: {
            locale: {
                currentLanguageTag: 'fr'
            },
            scripts: ['https://www.google.com/recaptcha/api.js?hl=fr'],
            recaptchaRequired: true,
            recaptchaSiteKey: '6LfQHvApAAAAAE73SYTd5vS0lB1Xr7zdiQ-6iBVa'
        }
    }
};

export const WithPasswordMinLength8: Story = {
    globals: {
        overrides: {
            passwordPolicies: {
                length: 8
            }
        }
    }
};

export const WithTermsAcceptance: Story = {
    globals: {
        overrides: {
            termsAcceptanceRequired: true,
            'x-keycloakify': {
                messages: {
                    termsText:
                        "<a href='https://example.com/terms'>Service Terms of Use</a>"
                }
            }
        }
    }
};

export const WithTermsNotAccepted: Story = {
    globals: {
        overrides: {
            termsAcceptanceRequired: true,
            messagesPerField: {
                existsError: (fieldName: string) => fieldName === 'termsAccepted',
                get: (fieldName: string) =>
                    fieldName === 'termsAccepted' ? 'You must accept the terms.' : ''
            }
        }
    }
};

export const WithFieldErrors: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    username: { value: '' },
                    email: { value: 'invalid-email' }
                }
            },
            messagesPerField: {
                existsError: (fieldName: string) =>
                    ['username', 'email'].includes(fieldName),
                get: (fieldName: string) => {
                    if (fieldName === 'username') return 'Username is required.';
                    if (fieldName === 'email') return 'Invalid email format.';
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
                    username: { value: 'johndoe', readOnly: true },
                    email: { value: 'jhon.doe@gmail.com', readOnly: false }
                }
            }
        }
    }
};

export const WithAutoGeneratedUsername: Story = {
    globals: {
        overrides: {
            profile: {
                attributesByName: {
                    username: { value: 'autogenerated_username' }
                }
            }
        }
    }
};

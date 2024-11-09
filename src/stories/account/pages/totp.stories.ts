import { Meta, StoryObj } from '@storybook/angular';
import { KcPageStory } from '../KcPageStory';

const meta: Meta<KcPageStory> = {
    title: 'account/totp.ftl',
    component: KcPageStory,
    globals: {
        pageId: 'totp.ftl'
    }
};

export default meta;

type Story = StoryObj<KcPageStory>;

export const Default: Story = {
    globals: {
        overrides: {
            totp: {
                enabled: false,
                totpSecretEncoded: 'HE4W MSTC OBKU CY2M ONXF OV3Q NYYU I3SH',
                totpSecret: '99fJbpUAcLsnWWpn1DnG',
                manualUrl:
                    'http://localhost:8080/realms/myrealm/account/totp?mode=manual',
                totpSecretQrCode:
                    'iVBORw0KGgoAAAANSUhEUgAAAPYAAAD2AQAAAADNaUdlAAACk0lEQVR4Xu2YQY6DMAxFjViw5AjcBC6GBBIXozfJEbpkger53wEKqOpmFvaikQYNeVRyHPvbiejXscp95jp+/D5zHT9+n7kO8qeIFDqKzjJo9dC1wUSPP7yG4IPq41lq9ZK+keLZSwXDGwMhOCZgdX4sBVD1qld+GYg/h6ScreBuIDo5FKfVM7Z8aWs9PB2E2/73DdOlwUrK9Ck+HDnzB7ziR8fjlD/OPI8pVQwCi899TkNw2M+tp9XSLFKPIq2UySIhBB906fCQTicFwiv1EUG6+d+bl4zPIYnUk5oIcS69/evPYStUp6P0dJhD/mhauijcth76mOsfw+GFrbfXKJx7LW2N15kijuWIMCYicLQOCEimDp1c0L8PzCLTs3/d+ZQLyl6VqeSIT9nz25szf2ZybHgC31yrXEQIbqaPjX0k9GqWy0N/nLkagsHWNXR0LZwsR357c0pjC6fm+meu5f6f6oszz/qj7GpYCdHf0LVH/gTgtJ/5bVavPJ9svwnBS9qaqwoHOh3G7Ln++HIIDgpKYpFW00dlkX7ruz836THBWQpzd23/xeDsFVroz15fRjsfMyaC8JX2Y8PZf+VIoKff+uTO6WSIUIfSkrl9/rbfnbPr30R8hnMtXA/98ea5lx4ZlSMgQlMsEnb73XnP+yNl/SuR3/lzTSZHMTirMpMcXjWr0U5Mp/rnzmk/TsXkC2/iKEJ5TRG4DZ5KrP/C0RiVmkp+5I8zN1uh2vv9Vs+bzJ4947Y+bz6wl6ZIcv87ZaU2+6PwnoKdb7VYmrf9Z02MxCmNdmparbVJtrA4nA+e9LgIS6dzfvly7j+4XWIuPJp8iE9PbvkzJHYNabt/o5MP+535t/Hj95nr+PH7zHX8m/8B+RAnloz5pi4AAAAASUVORK5CYII=',
                policy: {
                    type: 'totp'
                },
                qrUrl: 'http://localhost:8080/realms/myrealm/account/totp?mode=qr',
                otpCredentials: []
            },
            messagesPerField: {},
            stateChecker: 'ihTeSAMfNsobnPjYiktV8DY-5T4sVzVdrEZRdwfMm8Y',
            realm: {
                userManagedAccessAllowed: true,
                internationalizationEnabled: false
            },
            url: {
                totpUrl: 'http://localhost:8080/realms/myrealm/account/totp'
            },
            keycloakifyVersion: '9.6.1',
            themeVersion: '1.0.10',
            themeType: 'account',
            themeName: 'keycloakify',
            pageId: 'totp.ftl'
        }
    }
};

export const WithTotpEnabled: Story = {
    globals: {
        overrides: {
            totp: {
                enabled: true,
                totpSecretEncoded: 'G55E MZKC JFUD MQLT MFIF EVSB JFLG M6SO',
                totpSecret: '7zFeBIh6AsaPRVAIVfzN',
                manualUrl:
                    'http://localhost:8080/realms/myrealm/account/totp?mode=manual',
                supportedApplications: [
                    'totpAppFreeOTPName',
                    'totpAppMicrosoftAuthenticatorName',
                    'totpAppGoogleName'
                ],
                totpSecretQrCode:
                    'iVBORw0KGgoAAAANSUhEUgAAAPYAAAD2AQAAAADNaUdlAAACo0lEQVR4Xu2YPY6DMBCFJ6JwyRF8k+RiSCBxsXATjkDpAmX2vTGBwErbbDFTZIps4s8rmfl9RvRPW+W6crYvv66c7cuvK2cjX0Tkho9yW/q5PHSc5QYA62PwXnWqmzrRSUdNL+mygRC8kzQZWhqVO1CRds3YHopnfUkzp2c7ZAY+GIdXywOb0qsdJMXiFn9serYrncxNv/PDkdfUzObk/eNaX368mnl1kML8RH1vFoGzargA1DM/VeWhOpf9+by5iL5Q0NaEUETslHiSIz+dOc4q0tqBrcg7IsnpnZ8BeLmjqjFa4Fps4vlR3484nFHH6OP8o1cTc4I/Q3D4Uqw1TjpkeHqc2R/Rjvb89OUUDAL/CpycOf/o6fUjP505/phrOf8wn+tolsxyD8GZnzyrJSScrNyEcXhHJwrBh2yj2fShPlFB2PQxn935aK1HIB1G1nczm8+P+nbmC7si+zell53a4i97fnhz5Gddxc9iSgLPpPifGn9vDqN0YBL0lpozdx7nd+dDHSiFXkV+NlZO85Efzvzda8yrwkylvlEbhxE4bTJpiCEIkWNHbxD/w/++fJMOVX8p5Q70F0V2EI4LsUWd+ov6Wtgu5aM/OXNIf6jWbKq6zmekA77t88WZr5lXO6vvWaj6kbNo4nv/ceaon0TpYPqrmNJhue/x9+ZKLchbO+cLPrb+aI09BLeob1en2nqkKsUYfOvatSGa/ircmD7i78rNmJoYzXwIKh228z3+ztzef+Cb6S/lSxoWOXM2CO/ZuvlqARtLvX8u1Ie6+d+bd/X9pdS3lrrF/8jPCPytv9AVIbfvddxE4iNFLKL+hH/xCNudKgTvGX/r33ars/y062gQjljfWN8cyKm+f2NPOvqTL//Lvvy6crYvv66c7d/8B/9RFjk6Tp30AAAAAElFTkSuQmCC',
                policy: {
                    type: 'totp',
                    algorithm: 'HmacSHA1'
                },
                qrUrl: 'http://localhost:8080/realms/myrealm/account/totp?mode=qr',
                otpCredentials: [
                    {
                        id: '7afaaf7d-f2d5-44f5-a966-e5297f0b2b7a',
                        userLabel: 'mobile'
                    }
                ]
            },
            message: {
                summary: 'Mobile authenticator configured.',
                type: 'success'
            },
            url: {
                totpUrl: 'http://localhost:8080/realms/myrealm/account/totp'
            },
            messagesPerField: {},
            stateChecker: '0UvyCNJHRJXmdahtRmn0tTPCU2nwLtWBUfPwpJ8Ohkw',
            realm: {
                userManagedAccessAllowed: true,
                internationalizationEnabled: false
            },
            keycloakifyVersion: '9.6.1',
            themeVersion: '1.0.10',
            themeType: 'account',
            themeName: 'keycloakify',
            pageId: 'totp.ftl'
        }
    }
};

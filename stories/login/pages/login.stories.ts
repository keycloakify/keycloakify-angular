import { Meta, StoryObj } from '@storybook/angular';
import { DeepPartial } from 'keycloakify/tools/DeepPartial';
import { WrapperComponent } from '../../wrapper-component';
import { KcContext } from '../KcContext';

const meta: Meta<WrapperComponent> = {
  component: WrapperComponent,
};
export default meta;

type Story = StoryObj<WrapperComponent>;

const pageId: KcContext['pageId'] = 'login.ftl';
const overrides: DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>> = {};

export const Default: Story = {
  globals: {
    pageId,
    overrides,
  },
};
export const WithInvalidCredential: Story = {
  globals: {
    pageId,
    overrides: {
      login: {
        username: 'johndoe',
      },
      messagesPerField: {
        // NOTE: The other functions of messagesPerField are derived from get() and
        // existsError() so they are the only ones that need to mock.
        existsError: (fieldName: string, ...otherFieldNames: string[]) => {
          const fieldNames = [fieldName, ...otherFieldNames];
          return fieldNames.includes('username') || fieldNames.includes('password');
        },
        get: (fieldName: string) => {
          if (fieldName === 'username' || fieldName === 'password') {
            return 'Invalid username or password.';
          }
          return '';
        },
      },
    } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};
export const WithoutRegistration: Story = {
  globals: {
    pageId,
    overrides: { realm: { registrationAllowed: false } } satisfies DeepPartial<
      Extract<KcContext, { pageId: 'login.ftl' }>
    >,
  },
};
export const WithoutRememberMe: Story = {
  globals: {
    pageId,
    overrides: { realm: { rememberMe: false } } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};
export const WithoutPasswordReset: Story = {
  globals: {
    pageId,
    overrides: { realm: { resetPasswordAllowed: false } } satisfies DeepPartial<
      Extract<KcContext, { pageId: 'login.ftl' }>
    >,
  },
};
export const WithEmailAsUsername: Story = {
  globals: {
    pageId,
    overrides: { realm: { loginWithEmailAllowed: false } } satisfies DeepPartial<
      Extract<KcContext, { pageId: 'login.ftl' }>
    >,
  },
};
export const WithPresetUsername: Story = {
  globals: {
    pageId,
    overrides: { login: { username: 'max.mustermann@mail.com' } } satisfies DeepPartial<
      Extract<KcContext, { pageId: 'login.ftl' }>
    >,
  },
};
export const WithImmutablePresetUsername: Story = {
  globals: {
    pageId,
    overrides: {
      auth: {
        attemptedUsername: 'max.mustermann@mail.com',
        showUsername: true,
      },
      usernameHidden: true,
      message: {
        type: 'info',
        summary: 'Please re-authenticate to continue',
      },
    } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};
export const WithSocialProviders: Story = {
  globals: {
    pageId,
    overrides: {
      social: {
        displayInfo: true,
        providers: [
          {
            loginUrl: 'google',
            alias: 'google',
            providerId: 'google',
            displayName: 'Google',
            iconClasses: 'fa fa-google',
          },
          {
            loginUrl: 'microsoft',
            alias: 'microsoft',
            providerId: 'microsoft',
            displayName: 'Microsoft',
            iconClasses: 'fa fa-windows',
          },
          {
            loginUrl: 'facebook',
            alias: 'facebook',
            providerId: 'facebook',
            displayName: 'Facebook',
            iconClasses: 'fa fa-facebook',
          },
          {
            loginUrl: 'instagram',
            alias: 'instagram',
            providerId: 'instagram',
            displayName: 'Instagram',
            iconClasses: 'fa fa-instagram',
          },
          {
            loginUrl: 'twitter',
            alias: 'twitter',
            providerId: 'twitter',
            displayName: 'Twitter',
            iconClasses: 'fa fa-twitter',
          },
          {
            loginUrl: 'linkedin',
            alias: 'linkedin',
            providerId: 'linkedin',
            displayName: 'LinkedIn',
            iconClasses: 'fa fa-linkedin',
          },
          {
            loginUrl: 'stackoverflow',
            alias: 'stackoverflow',
            providerId: 'stackoverflow',
            displayName: 'Stackoverflow',
            iconClasses: 'fa fa-stack-overflow',
          },
          {
            loginUrl: 'github',
            alias: 'github',
            providerId: 'github',
            displayName: 'Github',
            iconClasses: 'fa fa-github',
          },
          {
            loginUrl: 'gitlab',
            alias: 'gitlab',
            providerId: 'gitlab',
            displayName: 'Gitlab',
            iconClasses: 'fa fa-gitlab',
          },
          {
            loginUrl: 'bitbucket',
            alias: 'bitbucket',
            providerId: 'bitbucket',
            displayName: 'Bitbucket',
            iconClasses: 'fa fa-bitbucket',
          },
          {
            loginUrl: 'paypal',
            alias: 'paypal',
            providerId: 'paypal',
            displayName: 'PayPal',
            iconClasses: 'fa fa-paypal',
          },
          {
            loginUrl: 'openshift',
            alias: 'openshift',
            providerId: 'openshift',
            displayName: 'OpenShift',
            iconClasses: 'fa fa-cloud',
          },
        ],
      },
    } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};
export const WithoutPasswordField: Story = {
  globals: {
    pageId,
    overrides: { realm: { password: false } } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};
export const WithErrorMessage: Story = {
  globals: {
    pageId,
    overrides: {
      message: {
        summary:
          'The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.',
        type: 'error',
      },
    } satisfies DeepPartial<Extract<KcContext, { pageId: 'login.ftl' }>>,
  },
};

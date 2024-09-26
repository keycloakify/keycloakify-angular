import { KcContext as KcLoginContext } from 'keycloakify/login/KcContext';
import { KcContext as KcAccountContext } from 'keycloakify/account/KcContext';

declare global {
  interface Window {
    kcContext?: KcLoginContext | KcAccountContext;
  }
}

export * from './models';
export * from './services';
export * from './providers/keycloakify-angular.providers';

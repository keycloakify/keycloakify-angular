import { KcContext as KcAccountContext } from 'keycloakify/account/KcContext';
import { KcContext as KcLoginContext } from 'keycloakify/login/KcContext';

declare global {
  interface Window {
    kcContext?: KcLoginContext | KcAccountContext;
  }
}

export * from './models';
export * from './providers/keycloakify-angular.providers';
export * from './services';

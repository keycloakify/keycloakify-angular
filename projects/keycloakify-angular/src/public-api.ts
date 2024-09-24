/*
 * Public API Surface of keycloakify-angular
 */
// DIRECTIVES
export * from './lib/login/directives';
// PIPES
export * from './lib/login/pipes';
// CLASSES
export * from './lib/login/classes/component-reference.class';
// SERVICES
export * from './lib/login/DefaultPage';
export {
  CLASSES,
  DO_MAKE_USER_CONFIRM_PASSWORD,
  I18N,
  KC_CONTEXT,
  USE_DEFAULT_CSS,
  provideKeycloakifyAngular,
  type KeycloakifyAngularConfig,
} from './lib/login/providers/keycloakify-angular.providers';
export * from './lib/login/services/resource-injector.service';

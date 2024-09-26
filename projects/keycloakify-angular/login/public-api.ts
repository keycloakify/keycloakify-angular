/*
 * Public API Surface of keycloakify-angular
 */
// DIRECTIVES
export * from './src/directives';
// PIPES
export * from './src/pipes';
// CLASSES
export * from './src/classes/component-reference.class';
// SERVICES
export * from './src/services';
// DEFAULT PAGE
export * from './src/DefaultPage';
// TEMPLATE
export { TemplateComponent } from './src/containers/template.component';
// COMPONENTS
export * from './src/components';
// PROVIDERS
export {
  CLASSES,
  DO_MAKE_USER_CONFIRM_PASSWORD,
  I18N,
  KC_CONTEXT,
  USE_DEFAULT_CSS,
  provideKeycloakifyAngular,
  type KeycloakifyAngularConfig,
} from './src/providers/keycloakify-angular.providers';

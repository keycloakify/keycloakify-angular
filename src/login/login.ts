import type { Type } from '@angular/core';
import type { ClassKey } from 'keycloakify/login';

export { i18nBuilder } from 'keycloakify/login/i18n/noJsx';

export { getDefaultPageComponent } from './defaultPage';

export type KcPage = {
    PageComponent: Type<unknown>;
    TemplateComponent: Type<unknown>;
    UserProfileFormFieldsComponent: Type<unknown>;
    doMakeUserConfirmPassword: boolean;
    doUseDefaultCss: boolean;
    classes: { [key in ClassKey]?: string };
};

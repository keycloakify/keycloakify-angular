import type { Type } from '@angular/core';
import type { ClassKey } from 'keycloakify/account';

export { i18nBuilder } from 'keycloakify/account/i18n/noJsx';

export { getDefaultPageComponent } from './defaultPage';

export type KcPage = {
    PageComponent: Type<unknown>;
    TemplateComponent: Type<unknown>;
    doUseDefaultCss: boolean;
    classes: { [key in ClassKey]?: string };
};

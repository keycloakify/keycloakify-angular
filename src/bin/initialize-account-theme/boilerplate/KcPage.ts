import { getDefaultPageComponent, type KcPage } from '@keycloakify/angular/account';
import { TemplateComponent } from '@keycloakify/angular/account/template';
import type { ClassKey } from 'keycloakify/account';
import type { KcContext } from './KcContext';

const classes = {} satisfies { [key in ClassKey]?: string };
const doUseDefaultCss = true;

export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
    switch (pageId) {
        default:
            return {
                PageComponent: await getDefaultPageComponent(pageId),
                TemplateComponent,
                doUseDefaultCss,
                classes
            };
    }
}

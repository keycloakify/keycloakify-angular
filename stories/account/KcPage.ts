import type { ClassKey } from 'keycloakify/account';
import { getDefaultPageComponent, type KcPage } from '../../src/account';
import { TemplateComponent } from '../../src/login/template';
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

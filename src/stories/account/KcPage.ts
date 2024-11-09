import { ClassKey } from 'keycloakify/account';
import { KcContext } from './KcContext';
import { getDefaultPageComponent, KcPage } from '../../account';
import { TemplateComponent } from '../../login/template';
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

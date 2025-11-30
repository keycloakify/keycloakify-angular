import type { ClassKey } from 'keycloakify/login';
import { getDefaultPageComponent, type KcPage } from '../../src/login';
import { UserProfileFormFieldsComponent } from '../../src/login/components/user-profile-form-fields';
import { TemplateComponent } from '../../src/login/template';
import type { KcContext } from './KcContext';

const classes = {} satisfies { [key in ClassKey]?: string };
const doUseDefaultCss = true;
const doMakeUserConfirmPassword = true;
export async function getKcPage(pageId: KcContext['pageId']): Promise<KcPage> {
    switch (pageId) {
        default:
            return {
                PageComponent: await getDefaultPageComponent(pageId),
                TemplateComponent,
                UserProfileFormFieldsComponent,
                doMakeUserConfirmPassword,
                doUseDefaultCss,
                classes
            };
    }
}

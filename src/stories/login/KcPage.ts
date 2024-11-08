import { ClassKey } from 'keycloakify/login';
import { KcContext } from './KcContext';
import { getDefaultPageComponent, KcPage } from '../../login';
import { TemplateComponent } from '../../login/template';
import { UserProfileFormFieldsComponent } from '../../login/components/user-profile-form-fields';
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

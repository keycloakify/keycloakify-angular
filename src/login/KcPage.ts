import { DefaultPage } from 'keycloakify-angular';
import { LoginThemePageId } from 'keycloakify/bin/shared/constants';
import { ClassKey } from 'keycloakify/login';

const classes = {} satisfies { [key in ClassKey]?: string };

const KcPage = async (pageId: LoginThemePageId) => {
  const doUseDefaultCss = true;
  const doMakeUserConfirmPassword = true;
  switch (pageId) {
    default:
      return DefaultPage(pageId, doMakeUserConfirmPassword, doUseDefaultCss, classes);
  }
};

export { KcPage };

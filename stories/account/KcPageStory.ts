import { createGetKcContextMock } from 'keycloakify/account/KcContext';
import { kcEnvDefaults, themeNames } from '../kc.gen';
import type { KcContext, KcContextExtension, KcContextExtensionPerPage } from './KcContext';
import KcPage from './KcPage';
import { DeepPartial } from 'keycloakify/tools/DeepPartial';

const kcContextExtension: KcContextExtension = {
  themeName: themeNames[0],
  properties: {
    ...kcEnvDefaults,
  },
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension,
  kcContextExtensionPerPage,
  overrides: {},
  overridesPerPage: {},
});

export function createKcPageStory<PageId extends KcContext['pageId']>(params: {
  pageId: PageId;
  overrides?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
}) {
  const { pageId, overrides } = params;
  const kcContextMock = getKcContextMock({
    pageId,
    overrides,
  });
  window.kcContext = kcContextMock;
  return KcPage(kcContextMock.pageId);
}

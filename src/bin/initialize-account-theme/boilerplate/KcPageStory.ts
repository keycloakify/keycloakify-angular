import {
    ChangeDetectorRef,
    Component,
    inject,
    type OnInit,
    type Type
} from '@angular/core';
import type { KcContext } from '@keycloakify/angular/account/KcContext';
import { provideKeycloakifyAngular } from '@keycloakify/angular/account/providers/keycloakify-angular';
import { TemplateComponent } from '@keycloakify/angular/account/template';
import { KC_ACCOUNT_CONTEXT } from '@keycloakify/angular/account/tokens/kc-context';
import { createGetKcContextMock } from 'keycloakify/account/KcContext';
import { kcEnvDefaults, themeNames } from '../kc.gen';
import type { KcContextExtension, KcContextExtensionPerPage } from './KcContext';
import { classes, doUseDefaultCss, getKcPage } from './KcPage';
import { getI18n } from './i18n';

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    }
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {},
    overridesPerPage: {}
});

type StoryContextLike = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globals: Record<string, any>;
};

export const decorators = (_: unknown, context: StoryContextLike) => ({
    applicationConfig: {
        providers: [
            provideKeycloakifyAngular({
                doUseDefaultCss: doUseDefaultCss,
                classes: classes,
                kcContext: getKcContextMock({
                    pageId: context.globals['pageId'],
                    overrides: context.globals['kcContext']
                }),
                getI18n: getI18n
            })
        ]
    }
});

@Component({
    selector: 'kc-page-story',
    template: `@if (pageComponent) {
        <kc-root [page]="pageComponent"></kc-root>
    }`,
    standalone: true,
    imports: [TemplateComponent]
})
export class KcPageStory implements OnInit {
    pageComponent: Type<unknown> | undefined;
    kcContext = inject<KcContext>(KC_ACCOUNT_CONTEXT);
    readonly #cd = inject(ChangeDetectorRef);
    ngOnInit() {
        getKcPage(this.kcContext.pageId).then(kcPage => {
            this.pageComponent = kcPage.PageComponent;
            this.#cd.markForCheck();
        });
    }
}

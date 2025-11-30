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
import type { StoryContext } from '@storybook/angular';
import { getKcContextMock } from './KcContextMock';
import { getKcPage } from './KcPage';
import { getI18n } from './i18n';

export const decorators = (_: unknown, context: StoryContext) => ({
    applicationConfig: {
        providers: [
            provideKeycloakifyAngular({
                doUseDefaultCss: true,
                classes: {},
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

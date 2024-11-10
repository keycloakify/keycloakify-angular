/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, OnInit, Type } from '@angular/core';
import { provideKeycloakifyAngular } from '@keycloakify/angular/login/providers/keycloakify-angular';
import { TemplateComponent } from '@keycloakify/angular/login/template';
import { StoryContext } from '@storybook/angular';
import { getI18n } from './i18n';
import { getKcContextMock } from './KcContextMock';
import { getKcPage } from './KcPage';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';

export const decorators = (_: unknown, context: StoryContext) => ({
    applicationConfig: {
        providers: [
            provideKeycloakifyAngular({
                doUseDefaultCss: true,
                classes: {},
                kcContext: getKcContextMock({
                    pageId: context.globals['pageId'],
                    overrides: context.globals['overrides']
                }),
                getI18n: getI18n
            })
        ]
    }
});

@Component({
    selector: 'kc-page-story',
    template: `@if (pageComponent) {
        <kc-root
            [page]="pageComponent"
            [userProfileFormFields]="userProfileFormFieldsComponent"
        ></kc-root>
    }`,
    standalone: true,
    imports: [TemplateComponent]
})
export class KcPageStory implements OnInit {
    pageComponent: Type<unknown> | undefined;
    kcContext = inject(KC_LOGIN_CONTEXT);
    userProfileFormFieldsComponent: Type<unknown> | undefined;
    ngOnInit() {
        getKcPage(this.kcContext.pageId).then(kcPage => {
            this.pageComponent = kcPage.PageComponent;
            this.userProfileFormFieldsComponent = kcPage.UserProfileFormFieldsComponent;
        });
    }
}

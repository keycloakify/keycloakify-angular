import { Component, inject, OnInit, Type } from '@angular/core';
import { KC_LOGIN_CONTEXT } from '../../login/tokens/kc-context';
import { getKcPage } from './KcPage';
import { TemplateComponent } from '../../login/template';
@Component({
    selector: 'kc-page-story',
    template: `@if (pageComponent) {
        <kc-root [page]="pageComponent"></kc-root>
    }`,
    standalone: true,
    imports: [TemplateComponent]
})
export class KcPageStory implements OnInit {
    pageComponent: Type<unknown> | null = null;
    kcContext = inject(KC_LOGIN_CONTEXT);
    ngOnInit() {
        getKcPage(this.kcContext.pageId).then(kcPage => {
            this.pageComponent = kcPage.PageComponent;
        });
    }
}

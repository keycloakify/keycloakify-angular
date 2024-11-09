import { Component, inject, OnInit, Type } from '@angular/core';
import { KC_ACCOUNT_CONTEXT } from '../../account/tokens/kc-context';
import { getKcPage } from './KcPage';
import { TemplateComponent } from '../../account/containers/template';
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
    kcContext = inject(KC_ACCOUNT_CONTEXT);
    ngOnInit() {
        getKcPage(this.kcContext.pageId).then(kcPage => {
            this.pageComponent = kcPage.PageComponent;
        });
    }
}

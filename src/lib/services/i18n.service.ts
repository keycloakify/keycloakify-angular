import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class I18nService<T> {
    i18n!: T;
}

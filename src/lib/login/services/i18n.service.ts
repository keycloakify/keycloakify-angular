import { Injectable } from '@angular/core';
import { I18n } from '../i18n';
@Injectable({ providedIn: 'root' })
export class I18nService {
  i18n!: I18n;
}
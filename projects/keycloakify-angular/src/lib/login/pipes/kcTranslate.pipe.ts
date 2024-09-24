import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18n } from 'keycloakify/login/i18n';
import { I18N } from '../providers/keycloakify-angular.providers';
@Pipe({
  name: 'kcTranslate',
  standalone: true,
})
export class KcTranslatePipe implements PipeTransform {
  readonly #i18n = inject<I18n>(I18N);
  transform(value: string, ...args: (string | undefined)[]): string {
    return this.#i18n.advancedMsgStr(value, ...args);
  }
}

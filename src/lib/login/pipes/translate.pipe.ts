import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18N } from '../i18n'
@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  readonly #i18n = inject(I18N);
  transform(value: string, ...args: (string | undefined)[]): string {
    return this.#i18n.advancedMsgStr(value, ...args);
  }
}
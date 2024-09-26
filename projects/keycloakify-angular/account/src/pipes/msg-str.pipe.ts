import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18N } from 'keycloakify-angular';
import { I18n } from 'keycloakify/account/i18n';
import { MessageKey } from 'keycloakify/account/i18n/messages_defaultSet/types';
@Pipe({
  name: 'msgStr',
  standalone: true,
})
export class MsgStrPipe implements PipeTransform {
  readonly #i18n = inject<I18n>(I18N);
  transform(value: MessageKey, ...args: (string | undefined)[]): string {
    return this.#i18n.msgStr(value, ...args);
  }
}
import { inject, Pipe, PipeTransform } from "@angular/core";
import { I18N } from "@keycloakify/angular/lib/public-api";
import { I18n } from "../i18n";
@Pipe({
    name: "advancedMsgStr",
    standalone: true
})
export class AdvancedMsgStrPipe implements PipeTransform {
    readonly #i18n = inject<I18n>(I18N);
    transform(value: string, ...args: (string | undefined)[]): string {
        return this.#i18n.advancedMsgStr(value, ...args);
    }
}

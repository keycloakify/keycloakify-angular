import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'inputType'
})
export class InputTypePipe implements PipeTransform {
    transform(inputType?: string): string {
        if (inputType?.startsWith('html5-')) {
            return inputType.slice(6);
        }

        return inputType ?? 'text';
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {
    transform(value: string | string[], emptyWhenString = false): string[] {
        // if (!value) throw new Error('must pass a value');
        if (value instanceof Array) {
            return value;
        }
        return emptyWhenString ? [] : [value];
    }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toArray',
    standalone: true
})
export class ToArrayPipe implements PipeTransform {
    transform(value: string | string[], emptyWhenString = false): string[] {
        if (value instanceof Array) {
            return value;
        }
        return emptyWhenString ? [] : [value];
    }
}

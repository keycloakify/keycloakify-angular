import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toNumber'
})
export class ToNumberPipe implements PipeTransform {
    transform(value: string | number): number {
        const number = parseInt(`${value}`);
        if (isNaN(number)) throw new Error('number is NaN');
        return number;
    }
}

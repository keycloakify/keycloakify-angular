import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'isArrayWithEmptyObject'
})
export class IsArrayWithEmptyObjectPipe implements PipeTransform {
    transform(variable: unknown): boolean {
        return (
            Array.isArray(variable) &&
            variable.length === 1 &&
            typeof variable[0] === 'object' &&
            Object.keys(variable[0]).length === 0
        );
    }
}

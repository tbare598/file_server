import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isUndefined' })
export class IsUndefinedPipe implements PipeTransform {
    transform(field) {
        return field == null;
    }
}

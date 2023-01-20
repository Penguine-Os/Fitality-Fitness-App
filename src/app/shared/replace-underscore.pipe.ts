import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceUnderscore'
})
export class ReplaceUnderscorePipe implements PipeTransform {
  transform(value: string, replacement=''): string {
    return value.replace('_',replacement);
  }


}

// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate',standalone: true  })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, completeWords = false, ellipsis = '...') {
    if (!value) return '';
    if (value.length <= limit) return value;

    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}
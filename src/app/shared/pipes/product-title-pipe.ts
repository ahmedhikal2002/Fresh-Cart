import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productTitle',
})
export class ProductTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    let words = value.split(' ');
    if (words.length === 2) return words.slice(0, 2).join(' ');
    else return words.slice(0, 2).join(' ') + '...';
  }
}

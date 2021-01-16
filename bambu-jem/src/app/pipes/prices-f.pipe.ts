import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricesF'
})
export class PricesFPipe implements PipeTransform {

  public transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: false
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number, decimals: number = 1, unit: string = ''): string {
    if (value === null || value === undefined) return '-';

    const formatted = value.toLocaleString('es-CO', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    return unit ? `${formatted} ${unit}` : formatted;
  }
}

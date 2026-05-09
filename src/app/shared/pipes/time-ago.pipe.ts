import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: false
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date): string {
    const date = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    }
    if (diffDay > 0) {
      return `Hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
    }
    if (diffHour > 0) {
      return `Hace ${diffHour} hora${diffHour > 1 ? 's' : ''}`;
    }
    if (diffMin > 0) {
      return `Hace ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    }
    return 'Hace un momento';
  }
}

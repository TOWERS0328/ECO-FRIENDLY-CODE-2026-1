import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';

@NgModule({
  declarations: [
    TimeAgoPipe,
    NumberFormatPipe
  ],
  imports: [CommonModule],
  exports: [
    TimeAgoPipe,
    NumberFormatPipe
  ]
})
export class SharedModule {}

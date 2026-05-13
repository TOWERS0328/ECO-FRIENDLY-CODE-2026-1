import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateRecyclingPageRoutingModule } from './validate-recycling-routing.module';

import { ValidateRecyclingPage } from './validate-recycling.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateRecyclingPageRoutingModule
  ],
  declarations: [ValidateRecyclingPage]
})
export class ValidateRecyclingPageModule {}

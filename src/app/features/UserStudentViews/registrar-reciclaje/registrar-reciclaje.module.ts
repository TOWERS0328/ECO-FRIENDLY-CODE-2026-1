import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarReciclajePageRoutingModule } from './registrar-reciclaje-routing.module';

import { RegistrarReciclajePage } from './registrar-reciclaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarReciclajePageRoutingModule
  ],
  declarations: [RegistrarReciclajePage]
})
export class RegistrarReciclajePageModule {}

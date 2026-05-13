import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WasteManagementPageRoutingModule } from './waste-management-routing.module';
import { WasteManagementPage } from './waste-management.page';
import { SharedModule } from '../../../shared/shared.module';  // ← Importa el modal

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,  // ← Agrega esto
    WasteManagementPageRoutingModule
  ],
  declarations: [WasteManagementPage]
})
export class WasteManagementPageModule {}

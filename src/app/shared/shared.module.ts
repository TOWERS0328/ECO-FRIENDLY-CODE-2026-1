import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Pipes
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';

// Componentes compartidos
import { WasteModalComponent } from './components/waste-modal/waste-modal.component';
import { RewardModalComponent } from './components/reward-modal/reward-modal.component';
import {  StudentModalComponent } from './components/student-modal/student-modal.component';

@NgModule({
  declarations: [
    TimeAgoPipe,
    NumberFormatPipe,
    WasteModalComponent,
    RewardModalComponent,
    StudentModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    // Pipes
    TimeAgoPipe,
    NumberFormatPipe,
    // Componentes
    WasteModalComponent,
    RewardModalComponent,
    StudentModalComponent,  // ← faltaba este
    // Módulos
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule {}

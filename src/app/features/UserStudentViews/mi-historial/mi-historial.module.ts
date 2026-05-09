import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// ── Servicios ────────────────────────────────────────────
import { HistoryService } from '../../../core/services/history.service';

// ── Página ───────────────────────────────────────────────
import { MiHistorialPage } from './mi-historial.page';

const routes: Routes = [
  {
    path: '',
    component: MiHistorialPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MiHistorialPage],
  providers: [HistoryService]
})
export class MiHistorialPageModule {}

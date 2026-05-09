import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarReciclajePage } from './registrar-reciclaje.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarReciclajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarReciclajePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateRecyclingPage } from './validate-recycling.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateRecyclingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateRecyclingPageRoutingModule {}

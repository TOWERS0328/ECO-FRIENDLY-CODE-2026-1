import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WasteManagementPage } from './waste-management.page';

const routes: Routes = [
  {
    path: '',
    component: WasteManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WasteManagementPageRoutingModule {}

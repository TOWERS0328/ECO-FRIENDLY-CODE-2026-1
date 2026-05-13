import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCoordiTabsPage } from './User-Coordi-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: UserCoordiTabsPage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'gestion-residuos',
        loadChildren: () => import('../waste-management/waste-management.module').then(m => m.WasteManagementPageModule)
      },
      {
        path: 'validar-reciclaje',
        loadChildren: () => import('../validate-recycling/validate-recycling.module').then(m => m.ValidateRecyclingPageModule)
      },
      {
        path: 'gestion-premios',
        loadChildren: () => import('../reward/reward-managemen.module').then(m => m.RewardManagementPageModule)
      },
      {
        path: 'estudiantes',
        loadChildren: () => import('../students/students.module').then(m => m.StudentsPageModule)
      },
      {
        path: 'estadisticas',
        loadChildren: () => import('../statistics/statistics.module').then(m => m.StatisticsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCoordiTabsPageRoutingModule {}

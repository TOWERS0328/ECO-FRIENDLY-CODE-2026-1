import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserStudentTabsPage } from './user-student-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: UserStudentTabsPage,
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
        path: 'perfil',
        loadChildren: () => import('../mi-perfil/mi-perfil.module').then(m => m.MiPerfilPageModule)
      },
      {
        path: 'reciclaje',
        loadChildren: () => import('../registrar-reciclaje/registrar-reciclaje.module').then(m => m.RegistrarReciclajePageModule)
      },
      {
        path: 'premios',
        loadChildren: () => import('../premios/premios.module').then(m => m.PremiosPageModule)
      },
      {
        path: 'historial',
        loadChildren: () => import('../mi-historial/mi-historial.module').then(m => m.MiHistorialPageModule)
      },
      {
        path: 'configuracion',
        loadChildren: () => import('../configuracion/configuracion.module').then(m => m.ConfiguracionPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserStudentTabsPageRoutingModule {}

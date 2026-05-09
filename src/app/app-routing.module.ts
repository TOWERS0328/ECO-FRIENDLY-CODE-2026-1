import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // ── Auth ─────────────────────────────────────────────
  {
    path: 'auth/login',
    loadChildren: () => import('./features/Auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'auth/register',
    loadChildren: () => import('./features/Auth/register/register.module').then(m => m.RegisterPageModule)
  },

  // ── Estudiante (apunta al módulo de tabs de estudiante) ──
  {
    path: 'estudiante',
    loadChildren: () => import('./features/UserStudentViews/user-student-tabs/user-student-tabs.module').then(m => m.UserStudentTabsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

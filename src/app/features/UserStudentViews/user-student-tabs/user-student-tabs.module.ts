import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';  // ← IMPORTANTE

import { UserStudentTabsPage } from './user-student-tabs.page';
import { UserStudentTabsPageRoutingModule } from './user-student-tabs-routing.module';

@NgModule({
  declarations: [UserStudentTabsPage],
  imports: [
    CommonModule,
    IonicModule,
    UserStudentTabsPageRoutingModule
  ]
})
export class UserStudentTabsPageModule {}

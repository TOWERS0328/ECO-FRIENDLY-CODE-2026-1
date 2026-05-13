import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { UserCoordiTabsPage } from './User-Coordi-tabs.page';
import { UserCoordiTabsPageRoutingModule } from './User-Coordi-tabs-routing.module';

@NgModule({
  declarations: [UserCoordiTabsPage],
  imports: [
    CommonModule,
    IonicModule,
    UserCoordiTabsPageRoutingModule
  ]
})
export class UserCoordiTabsPageModule {}

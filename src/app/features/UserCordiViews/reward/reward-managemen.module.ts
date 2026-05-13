import { WasteManagementPage } from '../waste-management/waste-management.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {  } from './reward-managemen-routing.module';
import { RewardManagementPage } from './reward-managemen.page';

import { SharedModule } from 'src/app/shared/shared.module';
import { RewardManagementPageRoutingModule } from './reward-managemen-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RewardManagementPageRoutingModule

  ],
  declarations: [RewardManagementPage]
})
export class RewardManagementPageModule {}

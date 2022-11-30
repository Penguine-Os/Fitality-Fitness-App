import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkOutsPageRoutingModule } from './work-outs-routing.module';

import { WorkOutsPage } from './work-outs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkOutsPageRoutingModule
  ],
  declarations: [WorkOutsPage]
})
export class WorkOutsPageModule {}

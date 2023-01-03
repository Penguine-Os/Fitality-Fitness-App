import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutNavigatorPageRoutingModule } from './workout-navigator-routing.module';

import { WorkoutNavigatorPage } from './workout-navigator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutNavigatorPageRoutingModule
  ],
  declarations: [WorkoutNavigatorPage]
})
export class WorkoutNavigatorPageModule {}

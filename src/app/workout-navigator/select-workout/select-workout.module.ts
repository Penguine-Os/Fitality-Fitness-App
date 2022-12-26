import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectWorkoutPageRoutingModule } from './select-workout-routing.module';

import { SelectWorkout } from './select-workout.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SelectWorkoutPageRoutingModule,
        SharedModule
    ],
  declarations: [SelectWorkout]
})
export class SelectWorkoutPageModule {}

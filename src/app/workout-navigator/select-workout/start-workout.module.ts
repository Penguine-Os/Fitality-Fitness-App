import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartWorkoutPageRoutingModule } from './start-workout-routing.module';

import { SelectWorkout } from './select-workout.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StartWorkoutPageRoutingModule,
        SharedModule
    ],
  declarations: [SelectWorkout]
})
export class StartWorkoutPageModule {}

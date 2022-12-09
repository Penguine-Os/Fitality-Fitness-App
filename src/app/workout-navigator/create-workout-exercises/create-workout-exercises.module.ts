import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWorkoutExercisesPageRoutingModule } from './create-workout-exercises-routing.module';

import { CreateWorkoutExercisesPage } from './create-workout-exercises.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateWorkoutExercisesPageRoutingModule,
        SharedModule
    ],
  declarations: [CreateWorkoutExercisesPage]
})
export class CreateWorkoutExercisesPageModule {}

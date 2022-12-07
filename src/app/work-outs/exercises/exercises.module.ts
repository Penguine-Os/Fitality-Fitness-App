import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesPageRoutingModule } from './exercises-routing.module';

import { ExercisesPage } from './exercises.page';
import {FetchExerciseModalComponent} from '../../Components/fetch-exercise-modal/fetch-exercise-modal.component';
import {ExerciseItemComponent} from '../../Components/exercise-item/exercise-item.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {WorkoutExerciseInputComponent} from '../../Components/workout-exercise-input/workout-exercise-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesPageRoutingModule,
    DragDropModule
  ],
    declarations: [ExercisesPage, FetchExerciseModalComponent, ExerciseItemComponent, WorkoutExerciseInputComponent]
})
export class ExercisesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FetchExerciseModalComponent} from './fetch-exercise-modal/fetch-exercise-modal.component';
import {WorkoutExerciseInputComponent} from './workout-exercise-input/workout-exercise-input.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule} from '@angular/forms';
import {WorkoutCardComponent} from './workout-card/workout-card.component';
import {SetsAndRepsComponent} from './sets-and-reps/sets-and-reps.component';
import {ExerciseInfoModalComponent} from './exercise-info-modal/exercise-info-modal.component';
import {EditExerciseInputsComponent} from './edit-exercise-inputs/edit-exercise-inputs.component';



@NgModule({
  declarations: [
    FetchExerciseModalComponent,
    WorkoutExerciseInputComponent,
    WorkoutCardComponent,
    SetsAndRepsComponent,
    ExerciseInfoModalComponent,
    EditExerciseInputsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    DragDropModule, FormsModule
  ],
  exports:  [
    FetchExerciseModalComponent,
    WorkoutExerciseInputComponent,
    WorkoutCardComponent,
    SetsAndRepsComponent,
    ExerciseInfoModalComponent,
    EditExerciseInputsComponent]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FetchExerciseModalComponent} from './fetch-exercise-modal/fetch-exercise-modal.component';
import {WorkoutExerciseInputComponent} from './workout-exercise-input/workout-exercise-input.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [FetchExerciseModalComponent,WorkoutExerciseInputComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    DragDropModule
  ],
  exports:  [FetchExerciseModalComponent,WorkoutExerciseInputComponent]
})
export class SharedModule { }

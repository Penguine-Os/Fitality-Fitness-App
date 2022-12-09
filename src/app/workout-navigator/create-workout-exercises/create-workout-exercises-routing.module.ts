import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateWorkoutExercisesPage } from './create-workout-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: CreateWorkoutExercisesPage
  },
  {
    path: 'create-workout',
    loadChildren: () => import('./create-workout/create-workout.module').then( m => m.CreateWorkoutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateWorkoutExercisesPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutNavigatorPage } from './workout-navigator.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutNavigatorPage
  },
  {
    path: 'create-workout-exercises',
    loadChildren: () => import('./create-workout-exercises/create-workout-exercises.module').then( m => m.CreateWorkoutExercisesPageModule)
  },
  {
    path: 'select-workout',
    loadChildren: () => import('./select-workout/start-workout.module').then(m => m.StartWorkoutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutNavigatorPageRoutingModule {}

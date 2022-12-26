import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectWorkout } from './select-workout.page';

const routes: Routes = [
  {
    path: '',
    component: SelectWorkout
  },
  {
    path: 'start-workout',
    loadChildren: () => import('./start-workout/start-workout.module').then( m => m.StartWorkoutPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectWorkoutPageRoutingModule {}

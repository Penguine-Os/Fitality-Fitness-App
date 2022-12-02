import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkOutsPage } from './work-outs.page';

const routes: Routes = [
  {
    path: '',
    component: WorkOutsPage
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
export class WorkOutsPageRoutingModule {}

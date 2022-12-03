import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkOutsPage } from './work-outs.page';

const routes: Routes = [
  {
    path: '',
    component: WorkOutsPage
  },  {
    path: 'exercises',
    loadChildren: () => import('./exercises/exercises.module').then( m => m.ExercisesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkOutsPageRoutingModule {}

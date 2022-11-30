import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkOutsPage } from './work-outs.page';

const routes: Routes = [
  {
    path: '',
    component: WorkOutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkOutsPageRoutingModule {}

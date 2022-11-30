import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'WorkoutTab',
        loadChildren: () => import('../work-outs/work-outs.module').then(m => m.WorkOutsPageModule)
      },
      {
        path: 'ProgressTab',
        loadChildren: () => import('../progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: 'InsightTab',
        loadChildren: () => import('../insight/insight.module').then(m => m.InsightPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/WorkoutTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/WorkoutTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

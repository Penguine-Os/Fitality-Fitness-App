import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [

      {
        path: 'WorkoutNavTab',
        loadChildren: () => import('../workout-navigator/workout-navigator.module').then(m => m.WorkoutNavigatorPageModule)
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
        redirectTo: '/tabs/WorkoutNavTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/WorkoutNavTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

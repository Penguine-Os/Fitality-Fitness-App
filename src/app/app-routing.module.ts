import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: (): any => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'progress',
    loadChildren: (): any => import('./progress/progress.module').then( m => m.ProgressPageModule)
  },
  {
    path: 'calender',
    loadChildren: (): any => import('./calender/calender.module').then(m => m.InsightPageModule)
  },
  {
    path: 'workout-navigator',
    loadChildren: (): any => import('./workout-navigator/workout-navigator.module').then( m => m.WorkoutNavigatorPageModule)
  },
  {
    path: 'login',
    loadChildren: (): any => import('./login/login.module').then( m => m.LoginPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

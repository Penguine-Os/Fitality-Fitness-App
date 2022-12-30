import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'progress',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./progress/progress.module').then( m => m.ProgressPageModule)
  },
  {
    path: 'workout-navigator',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./workout-navigator/workout-navigator.module').then( m => m.WorkoutNavigatorPageModule)
  },
  {
    path: 'login',
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

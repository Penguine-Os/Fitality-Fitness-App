import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable, Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutGuard implements CanActivate, OnDestroy {
  workoutSub = new Subscription();

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              private storage: FireStoreService,
              public authService: FireAuthService,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.workoutSub.unsubscribe();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userId = this.authService.currentUser?.value?.uid;
    const collectionName = `Workout-Routine-${userId}`;
    this.stateManagerService.setUserId(userId);
    this.stateManagerService.setCollectionName(collectionName);

    if (!userId) {
      return false;
    }

    //1 return firstValueFrom(this.storage.getWeekRoutine(collectionName))
    //2 return firstValueFrom(this.storage.collectionHaveDocs())
    return firstValueFrom(this.storage.collectionHaveDocs())
      .then(hasData => {
        if (hasData) {
          firstValueFrom(this.storage.getWeekRoutine(collectionName))
            .then(workouts=>{
              this.stateManagerService.getWorkouts((workouts));
            });
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        } else {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        }
        // if (workouts.length <= 0) {
        //   this.workoutSub = this.storage.collectionHaveDocs().subscribe(
        //     hasData =>{
        //       if (hasData){
        //         console.log(1);
        //         return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        //       }
        //       else {
        //         console.log(2);
        //         return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        //       }
        //     }
        //   );
        //   console.log(3);
        //   //return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        // } else {
        //   console.log(4);
        //   this.stateManagerService.getWorkouts((workouts));
        //   return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        // }
      });
  }
}

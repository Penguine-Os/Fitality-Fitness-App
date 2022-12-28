import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable, Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
@Injectable({
  providedIn: 'root'
})
export class WorkoutGuard implements CanActivate {

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              private storage: FireStoreService,
              public authService: FireAuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userId = this.authService.currentUser?.value?.uid;
    const collectionName=`Workout-Routine-${userId}`
    this.stateManagerService.setUserId(userId);
    this.stateManagerService.setCollectionName(collectionName);

    if (!userId) {
      return false;
    }

    return firstValueFrom(this.storage.getRoutine(collectionName))
      .then(workouts => {
        if (workouts.length <= 0) {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        } else {

          this.stateManagerService.getWorkouts((workouts));
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        }
      });
  }

  //
  // filteredWorkouts(workouts: Workout[]) {
  //   const today = new Date().getTime();
  //   const oneWeekFromNow = today + 7 * 24 * 60 * 60 * 1000;
  //   const filteredWorkouts = [];
  //
  //   for (const workout of workouts) {
  //     if (workout.isCompleted) {
  //       continue;
  //     }
  //     if (workout.startWorkoutTimeStamp.getTime() <= oneWeekFromNow) {
  //
  //       console.log(workout);
  //       filteredWorkouts.push(workout);
  //     }
  //   }
  //
  //   return filteredWorkouts;
  // }

}

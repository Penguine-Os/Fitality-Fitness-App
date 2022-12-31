import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
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
    const collectionName=`Workout-Routine-${userId}`;
    this.stateManagerService.setUserId(userId);
    this.stateManagerService.setCollectionName(collectionName);

    if (!userId) {
      return false;
    }

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
      });
  }
}

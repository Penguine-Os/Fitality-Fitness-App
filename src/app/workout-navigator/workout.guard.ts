import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable, Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
import {User} from 'firebase/auth';
import {WorkoutRoutine} from '../Models/WorkoutRoutine';

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
    if (!userId) {
      return false;
    }

    return firstValueFrom(this.storage.getRoutine('Workout-Routines-Template', userId))
      .then(workoutRoutine => {
        console.log(workoutRoutine);
        if (workoutRoutine.length <= 0) {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        } else {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        }
      })
  }

}

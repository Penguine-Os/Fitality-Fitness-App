import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
import {Workout} from '../Models/Workout';

@Injectable({
  providedIn: 'root'
})
export class WorkoutGuard implements CanActivate {

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              private fireStoreService: FireStoreService,
              public authService: FireAuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userId = this.authService.currentUser?.value?.uid;
    const collectionName = `Workout-Routine-${userId}`;
    const groupedWorkouts: Workout[][] = [];
    this.stateManagerService.setUserId(userId);
    this.stateManagerService.setCollectionName(collectionName);

    if (!userId) {
      return false;
    }

    return firstValueFrom(this.fireStoreService.collectionHaveDocs())
      .then(hasData => {
        if (hasData) {
          firstValueFrom(this.fireStoreService.getWeekRoutine(collectionName))
            .then(workouts => this.stateManagerService.getWorkouts((workouts)))
            .then(() => {
            this.fireStoreService.getAllRoutineWorkoutsGroupedByWeek(collectionName)
              .then(x => x.subscribe(y => {
                const [key, value] = y;
                groupedWorkouts.push(value);
              }))
              .then(() => this.stateManagerService.observableGroupedWorkouts.next(groupedWorkouts));
          });
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        } else {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        }
      });
  }
}

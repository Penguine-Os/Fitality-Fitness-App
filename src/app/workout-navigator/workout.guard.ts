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

    //return firstValueFrom(this.storage.getWeekRoutine(collectionName))
    return firstValueFrom(this.storage.collectionHaveDocs())
      .then(hasData => {
        console.log(hasData);
        this.stateManagerService.collectionHasDocs.next(hasData);
        if (!hasData) {
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
        } else {
          // this.workoutSub =  this.storage.getWeekRoutine(collectionName)
          //   .subscribe(workouts=> this.stateManagerService.getWorkouts((workouts)));
          return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
        }
      });
  }}

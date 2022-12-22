import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutGuard implements CanActivate {

  constructor(private stateManagerService: WorkoutExerciseStateManagerService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.stateManagerService.getWorkoutExercises().length <= 0) {
      console.log(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);

      return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
    } else {
      console.log(['tabs', 'WorkoutNavTab', 'select-workout']);
      return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
    }
  }

}

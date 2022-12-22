import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
import {User} from 'firebase/auth';
import {WorkoutRoutine} from '../Models/WorkoutRoutine';

@Injectable({
  providedIn: 'root'
})
export class WorkoutGuard implements CanActivate {
  public user: User;
  public workoutR: WorkoutRoutine[];
  private workoutRSub = new Subscription();

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              private storage: FireStoreService,
              public authService: FireAuthService,
              private router: Router) {

    this.workoutRSub = this.authService.currentUser.subscribe(x => {
      this.user = x;
      // this.workoutRSub = this.storage.getRoutine('Workout-Routines-Template',x.uid)
      //   .subscribe(y => this.workoutR = y);
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('canActivate', this.user.uid);
    console.log(this.workoutR);
    this.workoutR =  this.storage.getRoutine('Workout-Routines-Template', this.user.uid);
    if (this.workoutR.length <= 0) {
      console.log('insideIf');
      return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
    } else {
      return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'select-workout']);
    }

    //return this.router.createUrlTree(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);


  }

}

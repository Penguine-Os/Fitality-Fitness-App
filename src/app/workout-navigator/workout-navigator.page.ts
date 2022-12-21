import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
import {FireStoreService} from '../Services/FireBase/fire-store.service';
import {WorkoutRoutine} from '../Models/WorkoutRoutine';
import {Subscription} from 'rxjs';
import {User} from 'firebase/auth';


@Component({
  selector: 'app-workout-navigator',
  templateUrl: './workout-navigator.page.html',
  styleUrls: ['./workout-navigator.page.scss'],
})
export class WorkoutNavigatorPage implements OnInit {
  workoutR: WorkoutRoutine;
  wRoutineSub = new Subscription();
  user: User;
  userSub = new Subscription();

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              public authService: FireAuthService,
              private storage: FireStoreService,
              private router: Router) {

  }

  ionViewWillEnter() {
    // if (this.stateManagerService.getWorkoutExercises().length <= 0) {
    //   this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
    // } else {
    //   this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
    // }
    //this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
  }


  async ngOnInit() {
    const userId = 'CdUNk3tHzOPUlsDOIysAO3oDkwn2';
     this.userSub= this.authService.currentUser.subscribe(x =>{
       this.user = x;
       this.wRoutineSub = this.storage.getRoutine('Workout-Routines-Template',userId)
         .subscribe(y => this.workoutR = y[0]);
    console.log(this.workoutR);
     });
 //   console.log(this.storage.getRoutine('Workout-Routines-Template', userId));


  }


}

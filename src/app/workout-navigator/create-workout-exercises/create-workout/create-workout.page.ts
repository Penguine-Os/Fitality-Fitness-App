import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkoutFrequency} from '../../../Models/WorkoutFrequency';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {WorkoutRoutine} from '../../../Models/WorkoutRoutine';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {Subscription} from 'rxjs';
import {Workout} from '../../../Models/Workout';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit, OnDestroy {

  weekdays: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  trainingDays: WorkoutFrequency = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };
  weekRoutine = new Array<boolean>(7).fill(false);
  progressiveOverload: number;
  duration = 1;
  newWorkoutRoutine: WorkoutRoutine;
  workOutExercises: WorkoutExercise[];
  workOutExercisesSubscription = new Subscription();
  splitStrategies: { [key: string]: string } = {
    pushPull: 'Push-Pull',
    fullBody: 'Full-Body',
    upperBodyLowerBody: 'Upper-Body / Lower-Body'
  };

  selectedSplitStrategy = '';
  tempWorkoutsC: WorkoutExercise[] = [];

  constructor(public authService: FireAuthService,
              private exService: WorkoutExerciseStateManagerService) {
  }

  ngOnInit() {
    this.workOutExercisesSubscription = this.exService.observableWorkoutExercises.subscribe(
      xVal => this.workOutExercises = xVal
    );
  }

  ngOnDestroy() {
    this.workOutExercisesSubscription.unsubscribe();
  }

  rangeHandler(event: any) {
    this.progressiveOverload = event.detail.value / 100;
  }

  checkHandler() {
    this.exService.copyWeekRoutine(this.weekRoutine);
  }
  splitWeekWorkouts() {
    switch (this.selectedSplitStrategy) {
      case 'pushPull':
        this.exService.populateTempWorkoutExercisesAWithPushPull();
        break;
      case 'upperBodyLowerBody':
        this.exService.populateTempWorkoutExercisesBWithPushPull();
        break;
      case 'fullBody':
        this.exService.createFullBodyWorkouts();
        break;
      default:
        console.log('Select Split Strategy');
        break;

    }
    this.exService.creatWeeklyRoutineWorkouts();
  }

  selectOptionHandler(event: any) {
    this.selectedSplitStrategy = event.detail.value;
  }
}

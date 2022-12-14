import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkoutFrequency} from '../../../Models/WorkoutFrequency';
import {MatSliderModule} from '@angular/material/slider';
import {FireAuthService} from '../../../Services/Authentication/fire-auth.service';
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
  weekRoutine: boolean[] = Object.values(this.trainingDays);
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

  tempWorkoutsA: WorkoutExercise[] = [];
  tempWorkoutsB: WorkoutExercise[] = [];
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

  checkHandler(event: any) {
    console.log(this.trainingDays);
    console.log(this.weekRoutine);
  }

  createPushPullWorkouts() {
    this.workOutExercises.forEach(wEx => this.populatePushPullList(wEx));
    let switchExercises = true;
    const workouts: Workout[] = [];
    this.weekRoutine.forEach((val, index) => {
      if (!val) {
        return;
      }
      const workout: Workout = {
        id: '',
        exercisesPush: [],
        exercisesPull: [],
        exercisesFull: [],
        startWorkout: undefined,
        endWorkout: undefined,
        isCompleted: false,
        note: 'string'
      };
      if (switchExercises) {
        workout.exercisesPull = [...this.tempWorkoutsA];
      } else {
        workout.exercisesPush = [...this.tempWorkoutsB];
      }
      switchExercises = !switchExercises;
      workouts.push(workout);
    });
  }

  splitWeekWorkouts(workoutEx: WorkoutExercise) {
    switch (this.selectedSplitStrategy) {
      case 'pushPull':
        this.createPushPullWorkouts();
        break;
      case 'upperBodyLowerBody':
        this.populateUpperBodyLowerBody(workoutEx);
        break;
      case 'fullBody':
        this.tempWorkoutsC = [...this.workOutExercises];
        break;
      default:
        console.log('Select Split Strategy');
        break;

    }
  }

  selectOptionHandler(event: any) {
    this.selectedSplitStrategy = event.detail.value;
  }

  private populatePushPullList(workoutEx: WorkoutExercise) {
    switch (workoutEx.workoutExercise.muscle) {
      //pull
      case 'biceps':
      case 'forearms':
      case 'traps':
      case 'lats':
      case 'lower_back':
      case 'middle_back':
      case 'abductors':
        this.tempWorkoutsA.push(workoutEx);
        break;
      //push
      case 'chest':
      case 'triceps':
      case 'hamstrings':
      case 'quadriceps':
      case 'calves':
        this.tempWorkoutsB.push(workoutEx);
        break;
      default:
        this.tempWorkoutsA.push(workoutEx);
        this.tempWorkoutsB.push(workoutEx);
    }
  }

  private populateUpperBodyLowerBody(workoutEx: WorkoutExercise) {
    switch (workoutEx.workoutExercise.muscle) {
      //upper
      case 'biceps':
      case 'forearms':
      case 'triceps':
      case 'traps':
      case 'lats':
      case 'chest':
        this.tempWorkoutsA.push(workoutEx);
        break;
      //lower
      case 'lower_back':
      case 'middle_back':
      case 'abductors':
      case 'hamstrings':
      case 'quadriceps':
      case 'calves':
        this.tempWorkoutsB.push(workoutEx);
        break;
      default:
        this.tempWorkoutsA.push(workoutEx);
        this.tempWorkoutsB.push(workoutEx);
    }
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {WorkoutRoutine} from '../../../Models/WorkoutRoutine';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {Subscription} from 'rxjs';
import {FireStoreService} from '../../../Services/FireBase/fire-store.service';
import {AllWorkouts} from '../../../Models/AllWorkouts';
import {Timestamp }  from '@angular/fire/firestore';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit, OnDestroy {

  weekdays: string[] = ['Su','Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
  weekRoutine = new Array<boolean>(7).fill(false);
  progressiveOverload: number;
  duration = 1;
  workOutExercises: WorkoutExercise[];
  workOutExercisesSubscription = new Subscription();
  splitStrategies: { [key: string]: string } = {
    pushPull: 'Push-Pull',
    fullBody: 'Full-Body',
    upperBodyLowerBody: 'Upper-Body / Lower-Body'
  };

  selectedSplitStrategy = '';
  btnNextIsDisabled = true;

  constructor(public authService: FireAuthService,
              private storage: FireStoreService,
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

  splitExercisesAndCreateWeeklyWorkout() {
    let categorizedExercises: WorkoutExercise[][] = [];
    switch (this.selectedSplitStrategy) {
      case 'pushPull':
        categorizedExercises = this.exService.categorizePushPullExercises();
        break;
      case 'upperBodyLowerBody':
        categorizedExercises = this.exService.categorizeUpperAndLowerBodyExercises();
        break;
      case 'fullBody':
        categorizedExercises = [[], [], this.exService.allExercises()];
        break;
      default:
        console.log('Select Split Strategy');
        break;

    }
    this.exService.creatWeeklyRoutineWorkouts(categorizedExercises, this.selectedSplitStrategy);
    this.createWorkoutRoutine();
  }


  async createWorkoutRoutine() {
    const collectionName = `Workout-Routine-${this.authService.getUserUID()}`;
    const creationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setMonth(creationDate.getMonth() + this.duration);
    const wRoutine: WorkoutRoutine = {
      userId: this.authService.getUserUID(),
      routineSpan: this.duration,
      routineStartDate: Timestamp.fromDate(creationDate),
      routineEndDate: Timestamp.fromDate(expirationDate),
      weeklyWorkout: this.exService.getWeeklyWorkout(),
      // workoutDays: this.weekRoutine
      workoutDays: this.weekRoutine
    };
    const allWorkouts: AllWorkouts = {
      workouts: this.exService.workoutScheduler(creationDate,
        expirationDate, wRoutine.weeklyWorkout, wRoutine.workoutDays)
    };
    //await this.storage.storeWorkouts(collectionName, allWorkouts);
    await this.storage.batchedWrites(this.exService.workoutScheduler(creationDate,
      expirationDate, wRoutine.weeklyWorkout, wRoutine.workoutDays),collectionName);
  }

  selectOptionHandler(event: any) {
    this.selectedSplitStrategy = event.detail.value;
    this.btnNextIsDisabled = !this.btnNextIsDisabled;
    console.log(this.selectedSplitStrategy, this.btnNextIsDisabled);
  }
}

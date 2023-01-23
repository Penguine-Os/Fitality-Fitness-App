import {Component, OnDestroy, OnInit} from '@angular/core';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {WorkoutRoutine} from '../../../Models/WorkoutRoutine';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {FireStoreService} from '../../../Services/FireBase/fire-store.service';
import {Timestamp} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {from, scan} from 'rxjs';
import {Workout} from '../../../Models/Workout';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit, OnDestroy {

  weekdays: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  weekRoutine = new Array<boolean>(7).fill(false);
  progressiveOverload: number;
  duration = 1;
  splitStrategies: { [key: string]: string } = {
    pushPull: 'Push-Pull',
    fullBody: 'Full-Body',
    upperBodyLowerBody: 'Upper-Body / Lower-Body'
  };

  selectedSplitStrategy = '';
  btnNextIsDisabled = true;

  constructor(public authService: FireAuthService,
              private storage: FireStoreService,
              private exService: WorkoutExerciseStateManagerService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public async checkHandler(): Promise<void> {
    this.exService.copyWeekRoutine(this.weekRoutine);
  }

  public async splitExercisesAndCreateWeeklyWorkout(): Promise<void> {
    let categorizedExercises: WorkoutExercise[][] = [];
    switch (this.selectedSplitStrategy) {
      case 'pushPull':
        categorizedExercises = this.exService.categorizePushPullExercises();
        break;
      case 'upperBodyLowerBody':
        categorizedExercises = this.exService.categorizeUpperAndLowerBodyExercises();
        break;
      case 'fullBody':
        categorizedExercises = [[...this.exService.allExercises()], [...this.exService.allExercises()]];
        break;
      default:
        console.log('Select Split Strategy');
        break;

    }
    this.exService.creatWeeklyRoutineWorkouts(categorizedExercises, this.selectedSplitStrategy);
    this.createWorkoutRoutine()
      .then(() => setTimeout(() => this.router.navigate(['tabs', 'WorkoutNavTab']), 500));
  }

  public selectOptionHandler(event: any): void {
    this.selectedSplitStrategy = event.detail.value;
    this.btnNextIsDisabled = !this.btnNextIsDisabled;
  }

  private async createWorkoutRoutine(): Promise<void> {
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
      workoutDays: this.weekRoutine
    };
    //------------------------------------------ Poging 1 ------------------------------------------------//
    //-----------------------om voor elke workoutExercise in een een workoutArray----------------------//
    //-------------------------------de property weight gelijk te stellen aan-------------------------//
    //-------------------------------de vorige waarde plus progressiveOverload-------------------------//
    // from(this.exService.workoutScheduler(creationDate,
    //   expirationDate, wRoutine.weeklyWorkout, wRoutine.workoutDays))
    //   .pipe(
    //     scan((acc, value) => value.workoutExercises.map((value1, index) => {
    //       return value1.weight = acc.workoutExercises[index].weight + value1.progressiveOverload;
    //     }))).subscribe(x => console.log(x));
    //------------------------------------------ Poging 2 ------------------------------------------------//
    const workouts = this.exService.workoutScheduler(creationDate, expirationDate, wRoutine.weeklyWorkout, wRoutine.workoutDays);
//     const newArr: Workout[] = [];
//     let weight: number;
//     workouts.forEach((workout, i) => {
//       if (i === 0) {
//         newArr.push({...workout});
//         return;
//       }
//       const arr: Workout = structuredClone(workout);
//       arr.workoutExercises.forEach((y,z) => {
//         const previousWeight =  workouts[i - 1].workoutExercises[z].weight;
//         weight = previousWeight+ y.progressiveOverload;
//         workouts[i].workoutExercises[z].weight = weight;
//         y.weight =  weight;
//       });
//     //  console.log(arr);
//       newArr.push( structuredClone(arr));
//       // const workoutEx: WorkoutExercise[]=[];
//       // workout.workoutExercises.forEach((y, z) => {
//       //   weight = workouts[i - 1].workoutExercises[z].weight;
//       //   y.weight = y.progressiveOverload + weight;
//       // });
//       // newArr.push({workoutExercises:[] ,...workout});
//     });
// console.log(newArr);

    await this.storage.batchedWrites(workouts, collectionName)
      .then(() => this.exService.resetFieldVariables());
  }


}

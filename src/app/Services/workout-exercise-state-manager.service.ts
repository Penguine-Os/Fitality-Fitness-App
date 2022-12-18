import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ExerciseType} from '../Models/ExerciseType';
import {Workout} from '../Models/Workout';
import {WorkoutExercise} from '../Models/WorkoutExercise';
import {WeeklyWorkouts} from '../Models/WeeklyWorkouts';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseStateManagerService {

  #exercises: ExerciseType[] = [];
  #workoutExercises: WorkoutExercise[] = [];
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises);
  observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([]);
 observableWorkout: BehaviorSubject<Workout>;
  private weekRoutine = new Array<boolean>(7).fill(false);
  private weeklyWorkout: WeeklyWorkouts;

  constructor() {
  }
  getWorkout(wOut: Workout){
    this.observableWorkout =  new BehaviorSubject<Workout>(wOut);
  }

  getWorkoutExercises() {
    return this.#workoutExercises;
  }

  deleteExercise(deletedExercise: ExerciseType) {
    this.#exercises = this.#exercises.filter(x => x !== deletedExercise);
    this.#workoutExercises = this.#workoutExercises.filter(x => x.workoutExercise !== deletedExercise);
    this.observableExercises.next(this.#exercises);
    this.observableWorkoutExercises.next(this.#workoutExercises);
  }

  addExercises(data: ExerciseType[]) {

    data.forEach(x => {
      if (!this.#exercises.find(y => x.name === y.name)) {
        this.#exercises.push(x);
        this.mapExerciseTypesToWorkoutExercises(x);
      }
    });

    this.observableExercises.next(this.#exercises);
    this.observableWorkoutExercises.next(this.#workoutExercises);
  }

  mapExerciseTypesToWorkoutExercises(exVal: ExerciseType) {

    const workoutEx: WorkoutExercise = {
      workoutExercise: exVal,
      setsAndReps: [5,5,5,5],
      weight: 20,
      restDuration: 0,
      startExercise: 'undefined',
      endExercise: 'undefined',
      isCompleted: false,
      progressiveOverload: 0
    };

    this.#workoutExercises.push(workoutEx);

  }

  public splitPull(workoutEx: WorkoutExercise) {
    const pull = new Set(['biceps', 'forearms', 'traps', 'lats', 'lower_back', 'middle_back', 'abductors', 'neck']);
    if (pull.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitPush(workoutEx: WorkoutExercise) {
    const push = new Set(['chest', 'triceps', 'hamstrings', 'quadriceps', 'calves']);
    if (push.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitUpper(workoutEx: WorkoutExercise) {
    const upper = new Set(['biceps', 'forearms', 'traps', 'lats', 'chest', 'neck']);

    if (upper.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitLower(workoutEx: WorkoutExercise) {
    const lower = new Set(['lower_back', 'middle_back', 'abductors', 'hamstrings', 'quadriceps', 'calves']);

    if (lower.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public copyWeekRoutine(routine: boolean[]): void {
    this.weekRoutine = [...routine];
  }


  categorizePushPullExercises() {
    const allPull = this.#workoutExercises.map(x => this.splitPull(x)).filter(x => x !== undefined);
    const allPush = this.#workoutExercises.map(x => this.splitPush(x)).filter(x => x !== undefined);

    return [ allPush,allPull,[]];
  }

  categorizeUpperAndLowerBodyExercises() {
    const allUpper = this.#workoutExercises.map(x => this.splitUpper(x)).filter(x => x !== undefined);
    const allLower = this.#workoutExercises.map(x => this.splitLower(x)).filter(x => x !== undefined);
    return [allUpper, allLower,[]];
  }

  public creatWeeklyRoutineWorkouts(allEx: WorkoutExercise[][], splitStrategy: string) {
    const [workoutExA, workoutExB, workoutExFull] = allEx;

    // const workouts: Workout[] = [];
    const workoutNameA = splitStrategy === 'pushPull'? 'Push' : 'Upper-Body';
    const workoutNameB = splitStrategy === 'pushPull'? 'Pull' : 'Lower-Body';
    const workoutA: Workout = {
      workoutName: `Workout A:${workoutNameA}`,
      workoutExercises: workoutExA,
      startWorkout: new Date(),
      endWorkout: 'undefined',
      isCompleted: false,
      note: 'string'
    };
    const workoutB: Workout = {
      workoutName: `Workout B:${workoutNameB}`,
      workoutExercises: workoutExB,
      startWorkout: 'undefined',
      endWorkout: 'undefined',
      isCompleted: false,
      note: 'string'
    };

    const workoutFullBody: Workout = {
      workoutName: 'Full-Body',
      workoutExercises: workoutExFull,
      startWorkout: 'undefined',
      endWorkout: 'undefined',
      isCompleted: false,
      note: 'string'
    };


    this.weeklyWorkout = {
      splitName: splitStrategy,
      workoutA,
      workoutB,
      workoutFullBody
    };
  }


  public allExercises() {
    return [...this.#workoutExercises];
  }

  public getWeeklyWorkout() {
    return this.weeklyWorkout;
  }


  // public createWeeklyRoutines(workOuts: Workout[]) {
  //   for (let i = 0; i < this.#routineSpan; i++) {
  //     const weekWorkout: WeeklyWorkouts = {
  //       splitName: `Week ${i}`,
  //       weekWorkout: [...workOuts]
  //     };
  //     this.weeklyWorkouts.push(weekWorkout);
  //   }
  // }
}


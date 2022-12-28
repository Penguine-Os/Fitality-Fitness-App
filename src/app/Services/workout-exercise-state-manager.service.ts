import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ExerciseType} from '../Models/ExerciseType';
import {Workout} from '../Models/Workout';
import {WorkoutExercise} from '../Models/WorkoutExercise';
import {WeeklyWorkouts} from '../Models/WeeklyWorkouts';
import {WorkoutRoutine} from '../Models/WorkoutRoutine';
import {Timestamp} from '@angular/fire/firestore';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseStateManagerService {
  #exercises: ExerciseType[] = [];
  #workoutExercises: WorkoutExercise[] = [];
  #repVals: number[] = [];
  #collectionName: string;
  #userId: string;
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises);
  observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([]);
  observableIterator = new BehaviorSubject<number[][]>([]);
  observableRepVals = new BehaviorSubject<number[]>([]);
  observableWorkout = new BehaviorSubject<Workout>(undefined);
  observableWorkouts = new BehaviorSubject<Workout[]>(undefined);
  observableRoutine = new BehaviorSubject<WorkoutRoutine>(undefined);
  private weekRoutine = new Array<boolean>(7).fill(false);
  private weeklyWorkout: WeeklyWorkouts;

  constructor() {
  }

  getCollectionName(): string {
    return this.#collectionName;
  }

  setCollectionName(value: string) {
    this.#collectionName = value;
  }

  getUserId(): string {
    return this.#userId;
  }

  setUserId(value: string) {
    this.#userId = value;
  }

  getWorkouts(workouts: Workout[]) {
    this.observableWorkouts.next(workouts);
    // this.organizeWeeklyWorkout(wOutRoutine.workoutDays, wOutRoutine);
  }

  getWorkout(wOut: Workout) {
    this.generateIterator(wOut.workoutExercises);
    //  this.observableWorkout = new BehaviorSubject<Workout>(wOut);
    this.observableWorkout.next(wOut);
    this.observableWorkoutExercises.next(wOut.workoutExercises);
  }

  organizeWeeklyWorkout(workoutDays: boolean[], workoutR: WorkoutRoutine) {
    const workouts: Workout[] = [];
    let counter = 0;
    workoutDays.forEach((v, i) => {
      if (v) {
        counter++;
        const w = counter % 2 !== 0 ? workoutR.weeklyWorkout.workoutA : workoutR.weeklyWorkout.workoutB;
        if (!w.isCompleted) {
          workouts.push(w);
        }
      }
    });
    this.observableWorkouts.next(workouts);
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
    data.forEach((x, i) => {
      if (!this.#exercises.find(y => x.name === y.name)) {
        this.#exercises.push(x);
        this.#repVals.push(1);
        this.mapExerciseTypesToWorkoutExercises(x);
      }
    });
    this.observableRepVals.next(this.#repVals);
    this.observableExercises.next(this.#exercises);
    this.observableWorkoutExercises.next(this.#workoutExercises);
    this.generateIterator(this.#workoutExercises);
  }

  mapExerciseTypesToWorkoutExercises(exVal: ExerciseType) {

    const workoutEx: WorkoutExercise = {
      workoutExercise: exVal,
      completedSets: [false],
      setsAndReps: [1],
      weight: 5,
      restDuration: 0,
      startExerciseTimeStamp: 0,
      endExerciseTimeStamp: 0,
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

    return [allPush, allPull, []];
  }

  categorizeUpperAndLowerBodyExercises() {
    const allUpper = this.#workoutExercises.map(x => this.splitUpper(x)).filter(x => x !== undefined);
    const allLower = this.#workoutExercises.map(x => this.splitLower(x)).filter(x => x !== undefined);
    return [allUpper, allLower, []];
  }

  public creatWeeklyRoutineWorkouts(allEx: WorkoutExercise[][], splitStrategy: string) {
    const [workoutExA, workoutExB, workoutExFull] = allEx;

    // const workouts: Workout[] = [];
    const workoutNameA = splitStrategy === 'pushPull' ? 'Push' : 'Upper-Body';
    const workoutNameB = splitStrategy === 'pushPull' ? 'Pull' : 'Lower-Body';
    const workoutA: Workout = {
      id: uuidv4(),
      workoutRoleNr: '',
      workoutName: `Workout A:${workoutNameA}`,
      workoutExercises: workoutExA,
      startWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      endWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      isCompleted: false,
      note: 'string'
    };
    const workoutB: Workout = {
      id: uuidv4(),
      workoutRoleNr: '',
      workoutName: `Workout B:${workoutNameB}`,
      workoutExercises: workoutExB,
      startWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      endWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      isCompleted: false,
      note: 'string'
    };

    const workoutFullBody: Workout = {
      id: uuidv4(),
      workoutRoleNr: '',
      workoutName: 'Full-Body',
      workoutExercises: workoutExFull,
      startWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      endWorkoutTimeStamp: Timestamp.fromDate(new Date()),
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

  generateIterator(exercises: WorkoutExercise[]) {
    const tempArr: number[][] = [];
    exercises.forEach(x => tempArr.push(new Array(x.setsAndReps.length).fill(0)));
    this.observableIterator.next(tempArr);
  }

  workoutCompleted(workoutExs: WorkoutExercise[]): boolean {
    let workoutCompleted = true;
    workoutExs.forEach(ex => {
      if (!ex.completedSets.every(value => value === true)) {
        workoutCompleted = false;
      }

    });

    return workoutCompleted;
  }


  workoutScheduler(startTimestamp: Date, endTimestamp: Date, weeklyW: WeeklyWorkouts, workoutDays: boolean[]) {
    const currentDate = new Date(startTimestamp);
    const workouts: Workout[] = [];
    let counter = 0;
    while (currentDate < endTimestamp) {

      for (const item of workoutDays) {

        if (workoutDays[currentDate.getDay()]) {
          counter++;
          let w = counter % 2 !== 0 ? weeklyW.workoutA : weeklyW.workoutB;
          if (counter % 2 !== 0) {
            if (weeklyW.workoutA.workoutExercises.length !== 0) {
              w = weeklyW.workoutA;

            } else {
              w = weeklyW.workoutB;
            }


          } else {
            if (weeklyW.workoutB.workoutExercises.length !== 0) {
              w = weeklyW.workoutB;
            } else {
              w = weeklyW.workoutA;
            }


          }
          const copy: Workout = {
            id: w.id,
            workoutRoleNr: `workout-${counter}`,
            workoutName: w.workoutName,
            workoutExercises: w.workoutExercises,
            startWorkoutTimeStamp: Timestamp.fromDate(currentDate),
            endWorkoutTimeStamp: Timestamp.fromDate(currentDate),
            isCompleted: w.isCompleted,
            note: w.workoutName,
          };
          workouts.push(copy);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return workouts;
  }

  resetFieldVariables() {
    this.#exercises= [];
    this.#workoutExercises= [];
    this.#repVals = [];
    this.#collectionName =undefined;
    this.#userId=undefined;
    this.observableExercises = new BehaviorSubject<ExerciseType[]>(undefined);
    this.observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([]);
    this.observableIterator = new BehaviorSubject<number[][]>(undefined);
    this.observableRepVals = new BehaviorSubject<number[]>(undefined);
    this.observableWorkout = new BehaviorSubject<Workout>(undefined);
    this.observableWorkouts = new BehaviorSubject<Workout[]>(undefined);
    this.observableRoutine = new BehaviorSubject<WorkoutRoutine>(undefined);
    this.weekRoutine = new Array<boolean>(7).fill(false);
    this.weeklyWorkout=undefined;
  }

}


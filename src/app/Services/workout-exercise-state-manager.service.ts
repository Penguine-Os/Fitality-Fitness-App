import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
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
  #workoutExercises: WorkoutExercise[] = [];
  #repVals: number[] = [];
  #collectionName: string;
  #userId: string;
  observableGroupedWorkouts = new BehaviorSubject<Workout[][]>([]);
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

  setCollectionName(value: string): void {
    this.#collectionName = value;
  }

  getUserId(): string {
    return this.#userId;
  }

  setUserId(value: string): void {
    this.#userId = value;
  }

  getWorkouts(workouts: Workout[]): void {
    this.observableWorkouts.next(workouts);
  }

  getWorkout(wOut: Workout): void {
    this.generateIterator(wOut.workoutExercises);
    this.observableWorkout.next(wOut);
    this.observableWorkoutExercises.next(wOut.workoutExercises);
  }

  organizeWeeklyWorkout(workoutDays: boolean[], workoutR: WorkoutRoutine): void {
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


  deleteExercise(deletedExerciseName: string): void {
    this.#workoutExercises = this.#workoutExercises.filter(x => x.workoutExercise.name !== deletedExerciseName);

    this.observableWorkoutExercises.next(this.#workoutExercises);
  }

  addExercises(data: WorkoutExercise[]): void {
    data.forEach((x, i) => {
      if (!this.#workoutExercises.find(y => x.workoutExercise.name === y.workoutExercise.name)) {
        this.#workoutExercises.push(x);
        this.#repVals.push(1);
      }
    });
    this.observableRepVals.next(this.#repVals);
    this.observableWorkoutExercises.next(this.#workoutExercises);
    this.generateIterator(this.#workoutExercises);
  }

  public splitPull(workoutEx: WorkoutExercise): WorkoutExercise {
    const pull = new Set(['biceps', 'forearms', 'traps', 'lats', 'lower_back', 'middle_back', 'abductors', 'neck']);
    if (pull.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitPush(workoutEx: WorkoutExercise): WorkoutExercise {
    const push = new Set(['chest', 'triceps', 'hamstrings', 'quadriceps', 'calves']);
    if (push.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitUpper(workoutEx: WorkoutExercise): WorkoutExercise {
    const upper = new Set(['biceps', 'forearms', 'traps', 'lats', 'chest', 'neck']);

    if (upper.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public splitLower(workoutEx: WorkoutExercise): WorkoutExercise {
    const lower = new Set(['lower_back', 'middle_back', 'abductors', 'hamstrings', 'quadriceps', 'calves']);

    if (lower.has(workoutEx.workoutExercise.muscle.trim())) {
      return workoutEx;
    }
  }

  public copyWeekRoutine(routine: boolean[]): void {
    this.weekRoutine = [...routine];
  }


  categorizePushPullExercises(): WorkoutExercise [][] {
    const allPull = this.#workoutExercises.map(x => this.splitPull(x)).filter(x => x !== undefined);
    const allPush = this.#workoutExercises.map(x => this.splitPush(x)).filter(x => x !== undefined);

    return [allPush, allPull, []];
  }

  categorizeUpperAndLowerBodyExercises(): WorkoutExercise [][] {
    const allUpper = this.#workoutExercises.map(x => this.splitUpper(x)).filter(x => x !== undefined);
    const allLower = this.#workoutExercises.map(x => this.splitLower(x)).filter(x => x !== undefined);
    return [allUpper, allLower, []];
  }

  public creatWeeklyRoutineWorkouts(allEx: WorkoutExercise[][], splitStrategy: string): void {
    const [workoutExA, workoutExB] = allEx;

    // const workouts: Workout[] = [];
    let workoutNameA = '';
    let workoutNameB = '';

    switch (splitStrategy) {
      case 'pushPull':
        workoutNameA = 'Push';
        workoutNameB = 'Pull';
        break;
      case 'Upper-Body':
        workoutNameA = 'Upper-Body';
        workoutNameB = 'Lower-Body';
        break;
      case 'fullBody':
        workoutNameA = 'Full-Body';
        workoutNameB = 'Full-Body';

    }
    const workoutA: Workout = {
      id: uuidv4(),
      workoutRoleNr: '',
      workoutName: splitStrategy !== 'fullBody'?`Workout A:${' ' + workoutNameA}` : workoutNameA,
      workoutExercises: workoutExA,
      startWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      endWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      isCompleted: false,
      note: 'string'
    };
    const workoutB: Workout = {
      id: uuidv4(),
      workoutRoleNr: '',
      workoutName: splitStrategy !== 'fullBody'?`Workout B:${' ' + workoutNameB}` : workoutNameA,
      workoutExercises: workoutExB,
      startWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      endWorkoutTimeStamp: Timestamp.fromDate(new Date()),
      isCompleted: false,
      note: 'string'
    };
    this.weeklyWorkout = {
      splitName: splitStrategy,
      workoutA,
      workoutB,
    };
  }


  public allExercises(): WorkoutExercise [] {
    return [...this.#workoutExercises];
  }

  public getWeeklyWorkout(): WeeklyWorkouts {
    return this.weeklyWorkout;
  }

  public generateIterator(exercises: WorkoutExercise[]): void {
    const tempArr: number[][] = [];
    exercises.forEach(x => tempArr.push(new Array(x.setsAndReps.length).fill(0)));
    this.observableIterator.next(tempArr);
  }

  public workoutCompleted(workoutExs: WorkoutExercise[]): boolean {
    let workoutCompleted = true;
    workoutExs.forEach(ex => {
      if (!ex.completedSets.every(value => value === true)) {
        workoutCompleted = false;
      }

    });

    return workoutCompleted;
  }


  public workoutScheduler(startTimestamp: Date, endTimestamp: Date, weeklyW: WeeklyWorkouts, workoutDays: boolean[]): Workout[] {
    const currentDate = new Date(startTimestamp);
    const workouts: Workout[] = [];
    let counter = 0;
    while (currentDate < endTimestamp) {

      for (const item of workoutDays) {

        if (workoutDays[currentDate.getDay()]) {
          counter++;
          const w = counter % 2 !== 0 ? weeklyW.workoutA : weeklyW.workoutB;
          if (w.workoutExercises.length > 0) {
            const copy: Workout = {
              id: w.id,
              workoutRoleNr: `workout-${counter}`,
              workoutName: w.workoutName,
              workoutExercises: w.workoutExercises,
              startWorkoutTimeStamp: Timestamp.fromDate(currentDate),
              endWorkoutTimeStamp: Timestamp.fromDate(currentDate),
              isCompleted: w.isCompleted,
              note: '',
            };
            workouts.push(copy);
          }

        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return workouts;
  }

  public resetFieldVariables(): void {
   // this.#exercises = [];
    this.#workoutExercises = [];
    this.#repVals = [];
    this.#collectionName = undefined;
    this.#userId = undefined;
   // this.observableExercises.next([]);
    this.observableWorkoutExercises.next([]);
    this.observableIterator.next([]);
    this.observableRepVals.next([]);
    this.observableWorkout.next(undefined);
    this.observableWorkouts.next([]);
    this.observableRoutine.next(undefined);
    this.weekRoutine = new Array<boolean>(7).fill(false);
    this.weeklyWorkout = undefined;
  }

}


import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ExerciseType} from '../Models/ExerciseType';
import {Workout} from '../Models/Workout';
import {WorkoutExercise} from '../Models/WorkoutExercise';
import {v4 as uuidv4} from 'uuid';
import {WeeklyWorkouts} from '../Models/WeeklyWorkouts';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseStateManagerService {
  #routineSpan = 0;
  #exercises: ExerciseType[] = [];
  #workoutExercises: WorkoutExercise[] = [];
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises);
  observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([]);
  observableWeeklyWorkouts = new Observable<WeeklyWorkouts[]>();
  private tempWorkoutExercisesA: WorkoutExercise[] = [];
  private tempWorkoutExercisesB: WorkoutExercise[] = [];
  private weekRoutine = new Array<boolean>(7).fill(false);
  private weeklyWorkouts = new Array<WeeklyWorkouts>();

  constructor() {
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
      id: uuidv4(),
      workOutId: '',
      name: '',
      workoutExercise: exVal,
      sets: 1,
      reps: 1,
      weight: 20,
      restDuration: 0,
      getRestsBetweenSets() {
        return this.restDuration === 0 ? new Array(this.sets).fill(0) : new Array(this.sets).fill(this.restDuration);
      },
      startExercise: undefined,
      endExercise: undefined,
      isCompleted: false,
      progressiveOverload: 0
    };

    this.#workoutExercises.push(workoutEx);

  }

  public splitExercisesIntoPushPullList(workoutEx: WorkoutExercise) {
    switch (workoutEx.workoutExercise.muscle) {
      //pull
      case 'biceps':
      case 'forearms':
      case 'traps':
      case 'lats':
      case 'lower_back':
      case 'middle_back':
      case 'abductors':
        this.tempWorkoutExercisesA.push(workoutEx);
        break;
      //push
      case 'chest':
      case 'triceps':
      case 'hamstrings':
      case 'quadriceps':
      case 'calves':
        this.tempWorkoutExercisesB.push(workoutEx);
        break;
      default:
        this.tempWorkoutExercisesA.push(workoutEx);
        this.tempWorkoutExercisesB.push(workoutEx);
    }
  }

  public splitExercisesIntoUpperBodyLowerBody(workoutEx: WorkoutExercise) {
    switch (workoutEx.workoutExercise.muscle) {
      //upper
      case 'biceps':
      case 'forearms':
      case 'triceps':
      case 'traps':
      case 'lats':
      case 'chest':
        this.tempWorkoutExercisesA.push(workoutEx);
        break;
      //lower
      case 'lower_back':
      case 'middle_back':
      case 'abductors':
      case 'hamstrings':
      case 'quadriceps':
      case 'calves':
        this.tempWorkoutExercisesB.push(workoutEx);
        break;
      default:
        this.tempWorkoutExercisesA.push(workoutEx);
        this.tempWorkoutExercisesB.push(workoutEx);
    }
  }

  public copyWeekRoutine(routine: boolean[]): void {
    this.weekRoutine = [...routine];
  }

  public copyRoutineSpan(month: number): void {
    this.#routineSpan = month * 4;
    console.log(this.#routineSpan);
  }

  populateTempWorkoutExercisesWithPushPull() {
    this.#workoutExercises.forEach(wEx => this.splitExercisesIntoPushPullList(wEx));

  }

  populateTempWorkoutExercisesWithUpperAndLowerBody() {
    this.#workoutExercises.forEach(wEx => this.splitExercisesIntoUpperBodyLowerBody(wEx));

  }

  public creatWeeklyRoutineWorkouts() {
    let switchExercises = true;
    const workouts: Workout[] = [];
    this.weekRoutine.forEach(val => {
      if (!val) {
        return;
      }
      const workout: Workout = {
        workoutExercises: [],
        startWorkout: undefined,
        endWorkout: undefined,
        isCompleted: false,
        note: 'string'
      };

      if (switchExercises) {
        workout.workoutExercises = [...this.tempWorkoutExercisesA];
      } else {
        workout.workoutExercises = [...this.tempWorkoutExercisesB];
      }

      switchExercises = !switchExercises;
      workouts.push(workout);
    });
    console.log('Workout[]: ',workouts);
    this.createWeeklyRoutines(workouts);
   // console.log(this.weeklyWorkouts);
  }


  public createFullBodyWorkouts() {
    const workouts: Workout[] = [];
    this.weekRoutine.forEach(val => {
      if (!val) {
        return;
      }
      const workout: Workout = {
        workoutExercises: [],
        startWorkout: undefined,
        endWorkout: undefined,
        isCompleted: false,
        note: 'string'
      };
      workout.workoutExercises = [...this.#workoutExercises];
      workouts.push(workout);
    });
    this.createWeeklyRoutines(workouts);
  }

  public createWeeklyRoutines(workOuts: Workout[]) {
    for (let i = 0; i < this.#routineSpan; i++) {
      const weekWorkout: WeeklyWorkouts = {
        id: `Week ${i}`,
        weekWorkout: [...workOuts]
      };
      this.weeklyWorkouts.push(weekWorkout);
    }
  }
}


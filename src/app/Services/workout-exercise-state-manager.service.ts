import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ExerciseType} from '../Models/ExerciseType';
import {Workout} from '../Models/Workout';
import {WorkoutExercise} from '../Models/WorkoutExercise';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseStateManagerService {
  #exercises: ExerciseType[] = [];
  #workoutExercises: WorkoutExercise[] = [];
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises);
  observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([]);

  workout = new Observable<Workout>();

  constructor() {
  }

  getWorkoutExercises(){
    return this.#workoutExercises;
  }
  deleteExercise(deletedExercise: ExerciseType) {
    this.#exercises = this.#exercises.filter(x => x !== deletedExercise);
    this.#workoutExercises = this.#workoutExercises.filter(x => x.workoutExercise !== deletedExercise);
    this.observableExercises.next(this.#exercises);
    this.observableWorkoutExercises.next(this.#workoutExercises);
  }

  addExercises(data: ExerciseType[]) {

    data.forEach(x =>{
      if (!this.#exercises.find(y => x.name ===  y.name)) {
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
        sets: 0,
        reps: 0,
        weight: 0,
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

}


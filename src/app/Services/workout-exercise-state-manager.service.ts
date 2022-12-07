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
  #exercises: ExerciseType[] = []
  #workoutExercises: WorkoutExercise[] = []
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises)
  observableWorkoutExercises = new BehaviorSubject<WorkoutExercise[]>([])

  workout = new Observable<Workout>()

  constructor() {
    console.log(this.#exercises)
  }

  getExercises(){
    return this.#exercises
  }
  deleteExercise(deletedExercise: ExerciseType) {
    this.#exercises = this.#exercises.filter(x => x !== deletedExercise)
    this.observableExercises.next(this.#exercises);
  }

  populateExercises(data: ExerciseType[]) {

    data.forEach(x =>{
      if (!this.#exercises.find(y => x.name ===  y.name)) {
        this.#exercises.push(x)
        this.mapExerciseTypesToWorkoutExercises(x)
      }
    })

    this.observableExercises.next(this.#exercises)
  }
  mapExerciseTypesToWorkoutExercises(exVal: ExerciseType) {

      let workoutEx: WorkoutExercise = {
        id: uuidv4(),
        workOutId: '',
        name: '',
        workoutExercise: exVal,
        sets: 0,
        reps: 0,
        weight: 0,
        restDuration: 0,
        getRestsBetweenSets() {
          return this.restDuration === 0 ? [] : new Array(this.sets).fill(this.restDuration)
        },
        startExercise: undefined,
        endExercise: undefined,
        isCompleted: false,
        splitLabel: undefined
      }

      this.#workoutExercises.push(workoutEx)

  }

}


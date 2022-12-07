import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ExerciseType} from '../Models/ExerciseType';
import {Workout} from '../Models/Workout';

@Injectable({
  providedIn: 'root'
})
export class WorkoutExerciseStateManagerService {
  #exercises: ExerciseType[] = []
  observableExercises = new BehaviorSubject<ExerciseType[]>(this.#exercises)
  workout = new Observable<Workout>()
//changed
  constructor() {
    console.log(this.#exercises)
  }

  addExercise(addedExercise: ExerciseType) {

    // this.#exercises.push(addedExercise)
    if (!this.#exercises.find(x => x.name === addedExercise.name)) {
      this.#exercises.push(addedExercise)
    }
    this.observableExercises.next(this.#exercises)
  }

  deleteExercise(deletedExercise: ExerciseType) {
    console.log('fist log', this.#exercises)
    this.#exercises = this.#exercises.filter(x => x !== deletedExercise)
    this.observableExercises.next(this.#exercises);
    console.log('second log', this.#exercises)
  }

  populateExercises(data: ExerciseType[]) {
    console.log('fist log', this.#exercises)
    data.forEach(x =>{
      if (!this.#exercises.find(y => x.name ===  y.name)) {
        this.#exercises.push(x)
      }
    })
    console.log('second log', this.#exercises)
    this.observableExercises.next(this.#exercises)
  }
}


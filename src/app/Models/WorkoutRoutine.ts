import {Workout} from './Workout';

export interface WorkoutRoutine{
  routineStartDate: Date,
  routineEndDate: Date,
  routineWorkouts: Workout[]
}

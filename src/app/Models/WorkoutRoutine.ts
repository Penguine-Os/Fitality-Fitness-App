import {Workout} from './Workout';
import {WorkoutFrequency} from './WorkoutFrequency';

export interface WorkoutRoutine{
  routineStartDate: Date,
  routineEndDate: Date,
  routineWorkouts: Workout[]
  workoutDays : WorkoutFrequency
}

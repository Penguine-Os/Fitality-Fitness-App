import {Workout} from './Workout';
import {WorkoutFrequency} from './WorkoutFrequency';

export interface WorkoutRoutine{
  span: number
  routineStartDate: Date| undefined,
  routineEndDate: Date| undefined,
  weeklyWorkouts: Workout[]
  workoutDays : WorkoutFrequency
}

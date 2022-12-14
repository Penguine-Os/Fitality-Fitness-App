import {Workout} from './Workout';
import {WorkoutFrequency} from './WorkoutFrequency';
import {WeeklyWorkouts} from './WeeklyWorkouts';

export interface WorkoutRoutine {
  span: number;
  routineStartDate: Date | undefined;
  routineEndDate: (startDate: Date) => Date | undefined;
  allWorkouts: WeeklyWorkouts[];
  weeklyWorkout: Workout[];
  workoutDays: WorkoutFrequency;
  // allWorkouts:  Workout[][];
}

import {WeeklyWorkouts} from './WeeklyWorkouts';

export interface WorkoutRoutine {
  userId: string;
  span: number;
  routineStartDate: Date | string;
  weeklyWorkout: WeeklyWorkouts;
  workoutDays: Array<boolean>;
}

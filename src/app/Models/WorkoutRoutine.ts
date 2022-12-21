import {WeeklyWorkouts} from './WeeklyWorkouts';

export interface WorkoutRoutine {
  userId: string;
  routineSpan: number;
  routineStartDate: number;
  routineEndDate: number;
  weeklyWorkout: WeeklyWorkouts;
  workoutDays: Array<boolean>;
//  workoutDays: { [key: string]: string };
}

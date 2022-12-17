import {WeeklyWorkouts} from './WeeklyWorkouts';

export interface WorkoutRoutine {
  userId: string;
  span: number;
  routineStartDate: Date;
  routineEndDate: Date;
  weeklyWorkout: WeeklyWorkouts;
  workoutDays: Array<boolean>;
//  workoutDays: { [key: string]: string };
}

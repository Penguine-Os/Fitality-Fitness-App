import {WeeklyWorkouts} from './WeeklyWorkouts';
import { Timestamp } from 'firebase/firestore';

export interface WorkoutRoutine {
  userId: string;
  routineSpan: number;
  routineStartDate: Timestamp;
  routineEndDate: Timestamp;
  weeklyWorkout: WeeklyWorkouts;
  workoutDays: Array<boolean>;
//  workoutDays: { [key: string]: string };
}

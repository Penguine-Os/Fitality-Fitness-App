import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  workoutName: string;
  workoutExercises: WorkoutExercise[];
  startWorkoutTimeStamp: number;
  endWorkoutTimeStamp: number;
  isCompleted: boolean;
  note: string;
}

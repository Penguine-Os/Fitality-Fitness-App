import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  workoutName: string;
  workoutExercises: WorkoutExercise[];
  startWorkout: Date | string;
  endWorkout: Date | string;
  isCompleted: boolean;
  note: string;
}

import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  workoutExercises: WorkoutExercise[];
  startWorkout: Date | undefined;
  endWorkout: Date | undefined;
  isCompleted: boolean;
  note: string;
}

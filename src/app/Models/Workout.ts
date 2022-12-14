import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  id: string;
  exercisesPush: WorkoutExercise[];
  exercisesPull: WorkoutExercise[];
  exercisesFull: WorkoutExercise[];
  startWorkout: Date | undefined;
  endWorkout: Date | undefined;
  isCompleted: boolean;
  note: string;
}

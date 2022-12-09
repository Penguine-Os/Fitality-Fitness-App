import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  id: string;
  exercises: WorkoutExercise[];
  progressiveOverload: number;
  startWorkout: Date | undefined;
  endWorkout: Date | undefined;
  isCompleted: boolean;
  note: string;
}

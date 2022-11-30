import {WorkoutExercise} from './WorkoutExercis';

export interface Workout {
  name: string;
  exercises: WorkoutExercise[];
  progressiveOverload: number;
  executionDate: Date;
  startWorkout: Date;
  endWorkout: Date;
  isCompleted: boolean;
  note: string;
}

import {WorkoutExercise} from './WorkoutExercise';

export interface Workout {
  id: string
  name: string;
  exercises: WorkoutExercise[];
  progressiveOverload: number;
  executionDate: Date;
  startWorkout: Date;
  endWorkout: Date;
  isCompleted: boolean;
  note: string;
}

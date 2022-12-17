import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  workoutExercise: ExerciseType;
  sets: number;
  reps: number;
  weight: number;
  restDuration: number;
  startExercise: Date | string;
  endExercise: Date | string;
  isCompleted: boolean;
  progressiveOverload: number;

}

import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  workoutExercise: ExerciseType;
  sets: number;
  reps: number;
  weight: number;
  startExercise: Date;
  endExercise: Date;
  isCompleted: boolean;
}

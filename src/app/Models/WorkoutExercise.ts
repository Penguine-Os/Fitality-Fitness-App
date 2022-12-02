import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  id: string;
  workoutExercise: ExerciseType;
  sets: number;
  reps: number;
  weight: number;
  startExercise: Date;
  endExercise: Date;
  isCompleted: boolean;
}

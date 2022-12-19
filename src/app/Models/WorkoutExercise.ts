import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  workoutExercise: ExerciseType;
 setsAndReps: number[];
  completedSets: boolean[];
  weight: number;
  restDuration: number;
  startExercise: Date | string;
  endExercise: Date | string;
  isCompleted: boolean;
  progressiveOverload: number;

}

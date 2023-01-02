import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  id: string;
  workoutExercise: ExerciseType;
  setsAndReps: number[];
  completedSets: boolean[];
  weight: number;
  restDuration: number;
  startExerciseTimeStamp: number;
  endExerciseTimeStamp: number;
  isCompleted: boolean;
  progressiveOverload: number;

}

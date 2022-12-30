import {ExerciseType} from './ExerciseType';

export interface WorkoutExercise{
  workoutExerciseType: ExerciseType;
 setsAndReps: number[];
  completedSets: boolean[];
  weight: number;
  restDuration: number;
  startExerciseTimeStamp: number;
  endExerciseTimeStamp: number;
  isCompleted: boolean;
  progressiveOverload: number;

}

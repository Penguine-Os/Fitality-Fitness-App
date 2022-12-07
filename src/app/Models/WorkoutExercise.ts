import {ExerciseType} from './ExerciseType';
import {SplitStrategy} from './SplitStrategy';

export interface WorkoutExercise{
  id: string;
  name: string;
  workOutId: string;
  workoutExercise: ExerciseType;
  sets: number;
  reps: number;
  weight: number;
  restDuration: number;
  getRestsBetweenSets: Function;
  startExercise: Date | undefined;
  endExercise: Date | undefined;
  isCompleted: boolean;
  splitLabel : Array<SplitStrategy> | undefined

}

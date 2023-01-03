
export interface WorkoutEx<T>{
  id: string;
  name: string;
  workoutExercise: T;
  sets: number;
  reps: number;
  weight: number;
  startExercise: Date;
  endExercise: Date;
  isCompleted: boolean;
}

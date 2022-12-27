import {WorkoutExercise} from './WorkoutExercise';
import {Timestamp} from '@angular/fire/firestore';

export interface Workout {
  workoutName: string;
  workoutExercises: WorkoutExercise[];
  startWorkoutTimeStamp: Timestamp;
  endWorkoutTimeStamp: Timestamp;
  isCompleted: boolean;
  note: string;
}

import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  writeBatch,
  DocumentReference,
  Firestore,
  query,
  updateDoc, where
} from '@angular/fire/firestore';
import {WorkoutRoutine} from '../../Models/WorkoutRoutine';
import {Workout} from '../../Models/Workout';
import {AllWorkouts} from '../../Models/AllWorkouts';
import {map, Observable} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../workout-exercise-state-manager.service';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  constructor(private firestore: Firestore,
              private stateManagerService: WorkoutExerciseStateManagerService,) {
  }

  async storeWorkoutRoutine(collectionName: string, workoutRoutine: WorkoutRoutine): Promise<void> {
    console.log(workoutRoutine);
    await addDoc<WorkoutRoutine>(this.getCollectionRef<WorkoutRoutine>(collectionName), workoutRoutine);
  }

  async storeWorkouts(collectionName: string, allWorkouts: AllWorkouts): Promise<void> {
    await addDoc<AllWorkouts>(this.getCollectionRef<AllWorkouts>(collectionName), allWorkouts);
  }

  public getWeekRoutine(collectionName: string): Observable<Workout[]> {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    return collectionData<Workout>(
      query<Workout>(this.getCollectionRef(collectionName),
        where('startWorkoutTimeStamp', '>=', today),
        where('startWorkoutTimeStamp', '<=', oneWeekFromNow))
    ).pipe(
      map((wr) => wr.filter(x => !x.isCompleted))
    );
  }

  public getAllRoutineWorkouts(collectionName: string): Observable<Workout[]>  {
    return collectionData<Workout>(
      query<Workout>(this.getCollectionRef(collectionName)));
  }

  public async batchedWrites(workouts: Workout[], collectionName: string): Promise<void>  {
    const batch = writeBatch(this.firestore);
    let counter = 0;
    for (const item of workouts) {
      counter++;
      const docRef = doc(this.firestore, collectionName, `${item.workoutRoleNr}`);
      batch.set(docRef, item, {merge: true});
    }
    await batch.commit();
  }

  public async updateWorkout(collectionName: string, id: string, workout: Workout): Promise<void> {
    delete workout.id;
    await updateDoc(this.getDocumentRef(collectionName, id), workout);
  }

  public async batchDelete(workouts: Workout[]): Promise<void>  {
    const batch = writeBatch(this.firestore);
    const collectionName = this.stateManagerService.getCollectionName();
    let counter = 0;
    for (const item of workouts) {
      counter++;
      const docRef = doc(this.firestore, this.stateManagerService.getCollectionName(), `${item.workoutRoleNr}`);
      batch.delete(docRef);
    }
    await batch.commit();
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.firestore, `${collectionName}`, `${id}`) as DocumentReference<T>;
  }


}


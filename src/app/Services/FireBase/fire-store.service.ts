import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  getDoc,
  doc,
  writeBatch,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  deleteDoc,
  updateDoc, where
} from '@angular/fire/firestore';
import {firstValueFrom, Observable} from 'rxjs';
import {WorkoutRoutine} from '../../Models/WorkoutRoutine';
import {User} from 'firebase/auth';
import {FireAuthService} from './fire-auth.service';
import {Workout} from '../../Models/Workout';
import {AllWorkouts} from '../../Models/AllWorkouts';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(private firestore: Firestore, private fireAuth: FireAuthService) {
  }

  async storeWorkoutRoutine(collectionName: string, workoutRoutine: WorkoutRoutine): Promise<void> {
    console.log(workoutRoutine);
    await addDoc<WorkoutRoutine>(this.getCollectionRef<WorkoutRoutine>(collectionName), workoutRoutine);
  }

  async storeWorkouts(collectionName: string, allWorkouts: AllWorkouts): Promise<void> {
    await addDoc<AllWorkouts>(this.getCollectionRef<AllWorkouts>(collectionName), allWorkouts);
  }

  getRoutine(collectionName: string, dateA: Date, dateB: Date) {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    return collectionData<Workout>(
      query<Workout>(this.getCollectionRef(collectionName),
        where('startWorkoutTimeStamp', '>=', today),where('startWorkoutTimeStamp', '<=', oneWeekFromNow) )
    );
  }

  async batchedWrites(workouts: Workout[], collectionName: string) {
    const batch = writeBatch(this.firestore);
    console.log(workouts);
    let counter = 0;
    for (const item of workouts) {
      counter++;
      const docRef = doc(this.firestore, collectionName, `workout-${counter}`);
      batch.set(docRef, item, {merge: true});
      // await batch.commit();
    }
    await batch.commit();
  }

  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string): DocumentReference<T> {
    return doc(this.firestore, collectionName) as DocumentReference<T>;
  }


  private getCurrenUser(id: string) {
    return firstValueFrom(
      collectionData<User>(
        query<User>(
          this.getCollectionRef<User>('users'),
          where('id', '==', id)
        )
      )
    );
  }

}


import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  getDoc,
  doc,
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

  getRoutine(collectionName: string, userId) {
    // return collectionData<WorkoutRoutine>(
    //   query<WorkoutRoutine>(this.getCollectionRef(collectionName),where('userId','==', userId)
    //   ),
    // );
    let promiseResolved: WorkoutRoutine[];
    firstValueFrom(collectionData<WorkoutRoutine>(
      query<WorkoutRoutine>(this.getCollectionRef(collectionName),where('userId','==', userId)
      ),
    )).then(x=> {
      promiseResolved = x;
    });
    return promiseResolved;
  }
  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
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

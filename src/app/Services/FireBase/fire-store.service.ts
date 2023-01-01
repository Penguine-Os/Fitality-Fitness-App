import {Injectable} from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  writeBatch,
  DocumentReference,
  Firestore,
  query,
  updateDoc, where, limit
} from '@angular/fire/firestore';
import {Workout} from '../../Models/Workout';
import { firstValueFrom, from, groupBy, map, mergeMap, Observable, of, toArray, zip} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../workout-exercise-state-manager.service';
import moment from 'moment';
import {FireAuthService} from './fire-auth.service';
@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  collectionName: string;
  constructor(private firestore: Firestore,
              private fireAuth: FireAuthService,
              private stateManagerService: WorkoutExerciseStateManagerService,) {
    this.collectionName = `Workout-Routine-${this.fireAuth.getUserUID()}`;
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

  public getAllRoutineWorkouts(collectionName: string): Observable<Workout[]> {

    return collectionData<Workout>(
      query<Workout>(this.getCollectionRef(collectionName)));
  }

  public getAllRoutineWorkoutsGroupedByWeek(collectionName: string):  Promise<Observable<[number, Workout[]]>>{
    ///Niet mijn code
    ///Bron: => https://stackoverflow.com/questions/50332149/rxjs-groupby-observable-object
  return  firstValueFrom(collectionData<Workout>(
    query<Workout>(this.getCollectionRef(collectionName))))
    .then(x => {
      const source=from(x);
      return source.pipe(
        groupBy(workout => moment(workout.startWorkoutTimeStamp.toDate()).week()),
        mergeMap(group=> zip(of(group.key), group.pipe(toArray())))
      );
    });
  }

  public async batchedWrites(workouts: Workout[], collectionName: string): Promise<void>  {
    const batch = writeBatch(this.firestore);
    for (const item of workouts) {
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
    for (const item of workouts) {
      const docRef = doc(this.firestore, collectionName, `${item.workoutRoleNr}`);
      batch.delete(docRef);
    }
    await batch.commit();
  }
  public collectionHaveDocs(): Observable<boolean> {
    return  collectionData<Workout>(
      query<Workout>(this.getCollectionRef(this.stateManagerService.getCollectionName()),
        limit(1)))
      .pipe(
        map(w => w.length>0)
      );

  }
  private getCollectionRef<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  private getDocumentRef<T>(collectionName: string, id: string): DocumentReference<T> {
    return doc(this.firestore, `${collectionName}`, `${id}`) as DocumentReference<T>;
  }


}


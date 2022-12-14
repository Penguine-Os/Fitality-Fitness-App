import {Injectable} from '@angular/core';
import {FireAuthService} from './fire-auth.service';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  orderBy,
  query,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {WorkoutRoutine} from '../../Models/WorkoutRoutine';
@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor() { }
  async storeWorkoutRoutine(channel: string, message: string): Promise<void> {

  }
}

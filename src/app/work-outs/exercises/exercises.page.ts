import { Component, OnInit } from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {FetchExerciseModalComponent} from '../../Components/fetch-exercise-modal/fetch-exercise-modal.component';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-fetchedExercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {
  exercises: ExerciseType[]=[]
  workoutExercises: WorkoutExercise[]= []

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FetchExerciseModalComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {

      if (data === null)
        return;

       this.exercises = [...data];

      // this.exercises.map((val, index)=> this.workoutExercises[index].workoutExercise = val )

      this.exercises.forEach((exVal, index) => {

        let workoutEx: WorkoutExercise = {
          id: uuidv4 (),
          name: '',
          workoutExercise: exVal,
          sets: 0,
          reps: 0,
          weight: 0,
          startExercise: new Date(),
          endExercise:new Date() ,
          isCompleted: false,

        }

        this.workoutExercises.push(workoutEx);
      })
    }

  }

  private increaser(propType: string, workoutEx: WorkoutExercise) {

    switch (propType) {
      case 'weight':
        workoutEx.weight++
        break;
      case 'sets':
        workoutEx.sets++
        break;
      case 'reps':
        workoutEx.reps++
        break;

    }
  }
  private decreaser(propType: string, workoutEx: WorkoutExercise) {

    switch (propType) {
      case 'weight':
        workoutEx.weight = workoutEx.weight <= 0 ? 0 : --workoutEx.weight
        break;
      case 'sets':
        workoutEx.sets = workoutEx.sets <= 0 ? 0 : --workoutEx.sets
        console.log(workoutEx.sets)
        break;
      case 'reps':
        workoutEx.reps = workoutEx.reps <= 0 ? 0 : --workoutEx.reps
        break;

    }
  }

  increaseWeightHandler(propType: string, workoutEx: WorkoutExercise) {
    this.increaser(propType, workoutEx);
  }
  decreaseWeightHandler(propType: string, workoutEx: WorkoutExercise) {
    this.decreaser(propType, workoutEx);
  }

  increaseRepsHandler(propType: string, workoutEx: WorkoutExercise) {
    this.increaser(propType, workoutEx);
  }
  decreaseRepsHandler(propType: string, workoutEx: WorkoutExercise) {
    this.decreaser(propType, workoutEx);
  }

  increaseSetsHandler(propType: string, workoutEx: WorkoutExercise) {
    this.increaser(propType, workoutEx);
  }
  decreaseSetsHandler(propType: string, workoutEx: WorkoutExercise) {
    this.decreaser(propType, workoutEx);
  }
}



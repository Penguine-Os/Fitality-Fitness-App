import { Component, OnInit } from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {FetchExerciseModalComponent} from '../../Components/fetch-exercise-modal/fetch-exercise-modal.component';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';

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

       this.exercises.push(data);

      // this.exercises.map((val, index)=> this.workoutExercises[index].workoutExercise = val )

      this.exercises.forEach((exVal, index) => {

        let workoutEx: WorkoutExercise = {
          id: index.toString(),
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
        console.log(exVal.name)
      })

      console.log(this.workoutExercises)
    }
  }



}



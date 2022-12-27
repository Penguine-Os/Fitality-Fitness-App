import {Component, OnDestroy, OnInit} from '@angular/core';
import {WorkoutRoutine} from '../../Models/WorkoutRoutine';
import {Workout} from '../../Models/Workout';
import {AlertController} from '@ionic/angular';
import {FireAuthService} from '../../Services/FireBase/fire-auth.service';
import {Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Timestamp} from '@angular/fire/firestore';

@Component({
  selector: 'app-select-workout',
  templateUrl: './select-workout.page.html',
  styleUrls: ['./select-workout.page.scss'],
})
export class SelectWorkout implements OnInit, OnDestroy {
  workoutRoutine: WorkoutRoutine;
  btnIsDisabled = false;
  workouts: Workout[];


  constructor(private alertController: AlertController,
              public authService: FireAuthService,
              public stateManagerService: WorkoutExerciseStateManagerService) {
  }

  ionViewWillEnter() {
  }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.deleteRoutineFromFireStore();
          },
        },
      ],
    });

    await alert.present();
  }

  deleteRoutineFromFireStore() {
    throw new Error('Method not implemented.');
  }

  filteredWorkouts(workouts: Workout[]) {
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    const filteredWorkouts = [];

    for (const workout of workouts) {
      if (workout.isCompleted) {
        continue;
      }
      if (workout.startWorkoutTimeStamp <= Timestamp.fromDate(oneWeekFromNow)) {

        console.log(workout);
        filteredWorkouts.push(workout);
      }
    }

    return filteredWorkouts;
  }

  ngOnDestroy(): void {
  }
}

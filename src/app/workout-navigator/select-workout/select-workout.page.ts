import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {FireAuthService} from '../../Services/FireBase/fire-auth.service';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {FireStoreService} from '../../Services/FireBase/fire-store.service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-select-workout',
  templateUrl: './select-workout.page.html',
  styleUrls: ['./select-workout.page.scss'],
})
export class SelectWorkout implements OnInit, OnDestroy {
  btnIsDisabled = false;

  constructor(private alertController: AlertController,
              public authService: FireAuthService,
              private router: Router,
              public stateManagerService: WorkoutExerciseStateManagerService,
              private fireStoreService: FireStoreService,) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public async deleteAlert(): Promise<void> {
    const alert = await this.alertController.create({
      message: 'Delete entire Workout-Routine?!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (): void => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (): void => {
            this.deleteRoutineFromFireStore()
              .then(() => {
                setTimeout(() => this.router.navigate(['tabs', 'WorkoutNavTab']), 500);
              });
          },
        },
      ],
    });

    await alert.present();
  }

  private async deleteRoutineFromFireStore(): Promise<void> {
    firstValueFrom(this.fireStoreService.getAllRoutineWorkouts(this.stateManagerService.getCollectionName()))
      .then((workouts) => {
        this.fireStoreService.batchDelete(workouts);
      }).then(() => this.stateManagerService.resetFieldVariables());
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Haptics} from '@capacitor/haptics';
import {AlertController, IonRouterOutlet, ModalController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {ExerciseInfoModalComponent} from '../../../shared/exercise-info-modal/exercise-info-modal.component';
import {EditExerciseInputsComponent} from '../../../shared/edit-exercise-inputs/edit-exercise-inputs.component';
import {NativeAudio} from '@capgo/native-audio';
import {Router} from '@angular/router';
import {Capacitor} from '@capacitor/core';
import {Workout} from '../../../Models/Workout';
import {Subscription} from 'rxjs';
import {FireStoreService} from '../../../Services/FireBase/fire-store.service';
import {Timestamp} from '@angular/fire/firestore';
import {NotepadComponent} from '../../../shared/notepad/notepad.component';
import {promise} from 'protractor';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit, OnDestroy {


  workoutUpdate: Workout;
  workoutUpdateSub: Subscription = new Subscription();
  interval: NodeJS.Timeout;
  private repsVal: number;
  private toaster: HTMLIonToastElement;
  private modal: HTMLIonModalElement;
  private actions = new Set(['info', 'edit', 'note']);

  constructor(public toastCtrl: ToastController,
              private authService: FireAuthService,
              private fireStoreService: FireStoreService,
              public exStateManager: WorkoutExerciseStateManagerService,
              private modalController: ModalController,
              private routerOutlet: IonRouterOutlet,
              private router: Router,
              private alertController: AlertController) {

  }


  async ngOnInit(): Promise<void> {

    if (this.exStateManager.observableWorkout.getValue() === undefined) {
    await  this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
      return;
    }
    this.workoutUpdateSub = this.exStateManager.observableWorkout
      .subscribe(wVal => {
        this.workoutUpdate = wVal;
        const start = new Date();
        this.workoutUpdate.startWorkoutTimeStamp = Timestamp.fromDate(start);
      });
    const path = Capacitor.isNativePlatform() ? 'ring.mp3' : '/assets/ring.mp3';
    await NativeAudio.preload({
      assetId: 'ring',
      assetPath: path,
      audioChannelNum: 1,
      isUrl: false
    });

  }

  ngOnDestroy(): void {
    this.workoutUpdateSub.unsubscribe();
  }

  public async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      message: 'Workout Not Yet Completed!',
      buttons: [{
        text: 'Continue',
        role: 'cancel'
      },
        {
          text: 'Finish',
          role: 'confirm',
          handler: (): void => this.finishWorkout()
        }],
    });
    if (this.exStateManager.workoutCompleted(this.workoutUpdate.workoutExercises)) {
      this.finishWorkout();
      return;
    }
    await alert.present();

  }


  public async setClickHandler(exercise: WorkoutExercise, repsIndex: number): Promise<void> {

    this.repsVal = exercise.setsAndReps[repsIndex];

    if (!exercise.completedSets[repsIndex]) {
      return;
    }
    await this.presentToast(exercise.restDuration);

  }

  public async presentModal(action: string, i = 0): Promise<void> {
    let modalComponent;
    switch (action) {
      case 'edit':
        modalComponent = EditExerciseInputsComponent;
        break;
      case 'info':
        modalComponent = ExerciseInfoModalComponent;
        break;
      case 'note':
        modalComponent = NotepadComponent;
        break;
    }
    this.modal = await this.modalController.create({
      component: modalComponent,
      componentProps: {
        index: i,
      },
      cssClass: 'classModal',
      presentingElement: this.routerOutlet.nativeEl
    });
    await this.modal.present();

  }

  async ionViewWillLeave(): Promise<void> {
    if (this.toaster === undefined) {
      return;
    }
    await this.toaster.dismiss();
  }

  private async hapticsVibrate(duration: number): Promise<void> {
    await Haptics.vibrate({duration});
  };

  private async presentToast(duration: number): Promise<void> {

    duration *= 60;
    const remainingTime = duration;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    if (this.toaster !== undefined) {
      await this.toaster.dismiss().then(() => clearInterval(this.interval));
    }

    this.toaster = await this.createNewToast(minutes, seconds, duration);

    await Promise.all([
      this.toaster.present().then(() => this.interval = this.createCountDown(remainingTime, minutes, seconds)),
      this.playSound()
    ]).then(() => {
      this.toaster.onDidDismiss().then(() => {
        clearInterval(this.interval);
      });
    });

    await this.toaster.onDidDismiss().then(() => {
      clearInterval(this.interval);
    });

  }

  private finishWorkout(): void {
    const end = new Date();
    this.workoutUpdate.isCompleted = true;
    this.workoutUpdate.endWorkoutTimeStamp = Timestamp.fromDate(end);
    this.fireStoreService.updateWorkout(this.exStateManager.getCollectionName(),
      this.workoutUpdate.workoutRoleNr, this.workoutUpdate)
      .then(() => setTimeout(() => this.router.navigate(['tabs', 'WorkoutNavTab']), 500));
    //.then(()=>this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']))
  }

  private createCountDown(remainingTime, minutes, seconds): NodeJS.Timeout {
    return setInterval(() => {
      remainingTime--;
      minutes = Math.floor(remainingTime / 60);
      seconds = remainingTime % 60;
      this.toaster.message = `Good Work! Recovery in: ${minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;

      if (seconds < 4) {
        this.hapticsVibrate(500);
      }
      if (remainingTime <= 0) {
        //toast.dismiss();
        this.toaster.dismiss().then(() => clearInterval(this.interval));
      }

    }, 1000);
  }

  private async createNewToast(minutes: number, seconds: number, duration: number): Promise<HTMLIonToastElement> {
    return await this.toastCtrl.create({
      message: `Good Work! Recovery in: ${minutes}:${seconds >= 10 ? seconds : '0' + seconds}`,
      duration: duration * 1000,
      cssClass: 'custom-toast',
      icon: 'pulse-outline',
      buttons: [
        {
          side: 'end',
          icon: 'close-circle-outline',
          cssClass: '',
          role: 'cancel',
          handler: (): void => {
            this.toaster.onDidDismiss().then(() => {
              clearInterval(this.interval);
            });
          }
        }
      ],
      position: 'top'
    });
  }

  private async playSound(): Promise<void> {
    await Promise.all([NativeAudio.play({assetId: 'ring', time: 0}), this.hapticsVibrate(150)]);

  }
}

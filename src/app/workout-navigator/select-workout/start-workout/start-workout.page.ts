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

  constructor(public toastCtrl: ToastController,
              private authService: FireAuthService,
              private fireStoreService: FireStoreService,
              public exStateManager: WorkoutExerciseStateManagerService,
              private modalController: ModalController,
              private routerOutlet: IonRouterOutlet,
              private router: Router,
              private alertController: AlertController) {

  }

  async ngOnInit() {

    // if (this.exStateManager.observableWorkout.getValue() === undefined) {
    //   this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
    //   return;
    // }
    this.workoutUpdateSub = this.exStateManager.observableWorkout
      .subscribe(wVal => this.workoutUpdate = wVal);
    const path = Capacitor.isNativePlatform() ? 'ring.mp3' : '/assets/ring.mp3'
    await NativeAudio.preload({
      assetId: 'ring',
      assetPath:  path,
      audioChannelNum: 1,
      isUrl: false
    });

  }

  ngOnDestroy() {
    this.workoutUpdateSub.unsubscribe();
  }

  hapticsVibrate = async (duration: number) => {
    await Haptics.vibrate({duration});
  };

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Workout Not Yet Completed!',
      buttons: [{
        text: 'Continue',
        role: 'cancel'
      },
        {
          text: 'Finish',
          role: 'confirm',
          handler: () => this.finishWorkout()
        }],
    });
    if (this.exStateManager.workoutCompleted(this.workoutUpdate.workoutExercises)) {
      this.finishWorkout();
      return;
    }
    await alert.present();

  }

   finishWorkout() {
    this.workoutUpdate.isCompleted = true;
     this.fireStoreService.updateWorkout(this.exStateManager.getCollectionName(),
       this.workoutUpdate.workoutRoleNr,this.workoutUpdate)
       .then(()=>setTimeout(()=>this.router.navigate(['tabs', 'WorkoutNavTab']), 500))
       //.then(()=>this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']))
  }

  async presentToast(duration: number) {

    duration *= 60;
    const remainingTime = duration;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    if (this.toaster !== undefined) {
      await this.toaster.dismiss().then(() => clearInterval(this.interval));
    }

    this.toaster = await this.createNewToast(minutes, seconds, duration);

    await Promise.all([
      this.toaster.present().then(() => this.interval = this.countDown(remainingTime, minutes, seconds)),
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

  countDown(remainingTime, minutes, seconds) {
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

  async createNewToast(minutes: number, seconds: number, duration: number) {
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
          handler: () => {
            this.toaster.onDidDismiss().then(() => {
              clearInterval(this.interval);
            });
          }
        }
      ],
      position: 'top'
    });
  }

  async setClickHandler(exercise: WorkoutExercise, repsIndex: number) {

    this.repsVal = exercise.setsAndReps[repsIndex];

    if (!exercise.completedSets[repsIndex]) {
      return;
    }
    await this.presentToast(exercise.restDuration);

  }

  async presentModal(i: number, action: string) {
    const modalComp = action === 'info' ? ExerciseInfoModalComponent : EditExerciseInputsComponent;
    this.modal = await this.modalController.create({
      component: modalComp,
      componentProps: {
        index: i,
      },
      cssClass: 'classModal',
      presentingElement: this.routerOutlet.nativeEl
    });
    await this.modal.present();

  }

  async ionViewWillLeave() {
    if (this.toaster === undefined) {
      return;
    }
    await this.toaster.dismiss();
  }

  async playSound() {
    await Promise.all([NativeAudio.play({assetId: 'ring', time: 0}), this.hapticsVibrate(150)]);

  }
}

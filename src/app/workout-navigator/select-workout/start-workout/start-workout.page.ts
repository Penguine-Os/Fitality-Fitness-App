import { Component, OnDestroy, OnInit} from '@angular/core';
import {Haptics} from '@capacitor/haptics';
import {IonRouterOutlet, ModalController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {Workout} from '../../../Models/Workout';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {ExerciseInfoModalComponent} from '../../../shared/exercise-info-modal/exercise-info-modal.component';
import {EditExerciseInputsComponent} from '../../../shared/edit-exercise-inputs/edit-exercise-inputs.component';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit, OnDestroy {
  workout: Workout;
  btnFill: string;
  iterator: number[][] = [];
  checkState: string;
  initialRepVal: number;
  workoutSub = new Subscription();
  iteratorSub = new Subscription();
  interval: NodeJS.Timeout;
  private isFirstClick = true;
  private repsVal: number;
  private toaster: HTMLIonToastElement;
  private modal: HTMLIonModalElement;

  constructor(public toastCtrl: ToastController,
              private authService: FireAuthService,
              public exStateManager: WorkoutExerciseStateManagerService,
              private modalController: ModalController,
              private routerOutlet: IonRouterOutlet) {

  }

  async ngOnInit() {
    this.workoutSub = this.exStateManager.observableWorkout.subscribe(x => this.workout = x);
    this.iteratorSub = this.exStateManager.observableSetsAndReps.subscribe(x => this.iterator = x);
    this.workout.workoutExercises.map(x => x.restDuration = 0.15);
    console.log(this.iterator);

  }

  ngOnDestroy() {
    this.workoutSub.unsubscribe();
    this.iteratorSub.unsubscribe();
  }

  hapticsVibrate = async () => {
    await Haptics.vibrate({duration: 500});
  };


  async presentToast(duration: number) {

    duration *= 60;
    const remainingTime = duration;
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    if (this.toaster !== undefined) {
      await this.toaster.dismiss().then(() => clearInterval(this.interval));
    }

    this.toaster = await this.createNewToast(minutes, seconds, duration);

    await this.toaster.present();

    this.interval = this.countDown(remainingTime, minutes, seconds);

    await this.toaster.onDidDismiss().then(() => clearInterval(this.interval));


  }

  countDown(remainingTime, minutes, seconds) {
    return setInterval(() => {

      remainingTime--;
      minutes = Math.floor(remainingTime / 60);
      seconds = remainingTime % 60;
      this.toaster.message = `Good Work! Recovery in: ${minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;

      if (seconds < 4) {
        this.hapticsVibrate();
      }
      // console.log(this.isUnchecked);
      if (this.repsVal <= 0) {
        //toast.dismiss();
        this.toaster.dismiss().then(() => clearInterval(this.interval));
      }

    }, 1000);
  }

  async createNewToast(minutes: number, seconds: number, duration: number) {
    return await this.toastCtrl.create({
      message: `Good Work! Recovery in: ${minutes}:${seconds >= 10 ? seconds : '0' + seconds}`,
      duration: duration * 1000,
      icon: 'pulse-outline',
      position: 'top'
    });
  }

  setClickHandler(exercise: WorkoutExercise, repsIndex: number) {

    this.repsVal = exercise.setsAndReps[repsIndex];
    exercise.completedSets[repsIndex] = true;

    if (this.checkState === 'outline') {
      exercise.completedSets[repsIndex] = false;
      return;
    }
    if (this.isFirstClick) {
      this.initialRepVal = exercise.setsAndReps[repsIndex];
      this.isFirstClick = false;
    }
    this.presentToast(exercise.restDuration);
  }

  async presentModal(i: number, action: string) {
    const modalComp = action === 'info' ? ExerciseInfoModalComponent : EditExerciseInputsComponent;
    this.modal = await this.modalController.create({
      component: modalComp,
      componentProps: {
        index: i,
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await this.modal.present();

  }

  async ionViewWillLeave() {
    await this.toaster.dismiss();
  }
}

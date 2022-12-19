import {Component, OnDestroy, OnInit} from '@angular/core';
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {AlertController, IonRouterOutlet, ModalController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {Workout} from '../../../Models/Workout';
import {WeeklyWorkouts} from '../../../Models/WeeklyWorkouts';
import {ActivatedRoute} from '@angular/router';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';
import {ExerciseInfoModalComponent} from '../../../shared/exercise-info-modal/exercise-info-modal.component';
import {ExerciseType} from '../../../Models/ExerciseType';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit, OnDestroy {
  workout: Workout;
  btnFill: string;
  iterator: boolean[][] = [];
  checkState: string;
  initialRepVal: number;
  workoutSub = new Subscription();
  interval: NodeJS.Timeout;
  private isFirstClick = true;
  private repsVal: number;
  private clicks = 0;
  private toaster: HTMLIonToastElement;


  constructor(public toastCtrl: ToastController,
              public authService: FireAuthService,
              private exStateManager: WorkoutExerciseStateManagerService,
              private modalController: ModalController,
              private routerOutlet: IonRouterOutlet) {

  }

  async ngOnInit() {
    this.workoutSub = this.exStateManager.observableWorkout.subscribe(x => this.workout = x);
    this.workout.workoutExercises.map(x => x.restDuration = 0.15);

    //VERSCHRIKKELIJK
    this.workout.workoutExercises.forEach(x => this.iterator.push(new Array(x.setsAndReps.length).fill(true)));
    //VERSCHRIKKELIJK
    console.log(this.workout.workoutExercises[0]);
  }

  ionViewWillEnter() {
    //this.workout.workoutExercises.forEach(x => this.iterator.push(new Array(x.setsAndReps.length).fill('')));
  }

  ngOnDestroy() {
    this.workoutSub.unsubscribe();
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
      icon: 'globe',
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

    // if (this.repsVal <= 0 || exercise.restDuration <= 0) {
    //   this.isUnchecked = true;
    // }

    // if (this.clicks > 1 && this.initialRepVal === this.repsVal) {
    //   return;
    // }
    this.presentToast(exercise.restDuration);
  }

  async presentModal(i: number) {
    const modal = await this.modalController.create({
      component: ExerciseInfoModalComponent,
      componentProps: {
        index: i,
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async ionViewWillLeave() {
    await this.toaster.dismiss();
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {AlertController, ToastController} from '@ionic/angular';
import {FireAuthService} from '../../../Services/FireBase/fire-auth.service';
import {Workout} from '../../../Models/Workout';
import {WeeklyWorkouts} from '../../../Models/WeeklyWorkouts';
import {ActivatedRoute} from '@angular/router';
import {WorkoutExerciseStateManagerService} from '../../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {WorkoutExercise} from '../../../Models/WorkoutExercise';

@Component({
  selector: 'app-start-workout',
  templateUrl: './start-workout.page.html',
  styleUrls: ['./start-workout.page.scss'],
})
export class StartWorkoutPage implements OnInit, OnDestroy {
  workout: Workout;
  btnFill: string;
  iterator: number[];
  initialRepVal: number;
  workoutSub = new Subscription();
  private isFirstClick = true;
  private repsVal: number;
  private clicks=0;

  constructor(public toastCtrl: ToastController,
              public authService: FireAuthService,
              private exStateManager: WorkoutExerciseStateManagerService) {
  }

  ngOnInit() {
    this.workoutSub = this.exStateManager.observableWorkout.subscribe(x => this.workout = x);
    this.workout.workoutExercises.map(x => x.restDuration = 0.15);
    console.log(this.workout);
    this.iterator = new Array<number>(5).fill(0);
    console.log(this.iterator);

  }

  ngOnDestroy() {
    this.workoutSub.unsubscribe();
  }

  hapticsVibrate = async () => {
    await Haptics.vibrate({duration: 500});
  };


  async presentToast(duration: number) {

    duration *= 60;

    let remainingTime = duration;
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;

    const toast = await this.toastCtrl.create({
      message: `Good Work! Recovery in: ${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`,
      duration: duration * 1000,
      icon: 'globe',
      position: 'top'
    });


    toast.present();


    const interval = setInterval(() => {

      remainingTime--;
      minutes = Math.floor(remainingTime / 60);
      seconds = remainingTime % 60;

      toast.message = `Good Work! Recovery in: ${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
      if (seconds < 4) {
        this.hapticsVibrate();
      }
      // console.log(this.isFirstClick);
      if (this.repsVal <= 0 ) {
        toast.dismiss();
      }

    }, 1000);

    toast.onDidDismiss().then(() => {
      clearInterval(interval);

    });
  }

  setClickHandler(exercise: WorkoutExercise, repsIndex: number) {
    this.clicks++;
    this.repsVal = exercise.setsAndReps[repsIndex];
    if (this.isFirstClick) {
      this.initialRepVal = exercise.setsAndReps[repsIndex];
      this.isFirstClick = false;
    }
    if (this.repsVal <= 0 || exercise.restDuration <= 0) {
      this.isFirstClick = true;
    }

    if (this.clicks>1 && this.initialRepVal === this.repsVal){
      return;
    }
    this.presentToast(exercise.restDuration);
  }
}

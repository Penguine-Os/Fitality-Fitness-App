import {Component, OnInit} from '@angular/core';
import {WorkoutRoutine} from '../../Models/WorkoutRoutine';
import {Workout} from '../../Models/Workout';
import {AlertController} from '@ionic/angular';
import {Haptics, VibrateOptions} from '@capacitor/haptics';
import {FireAuthService} from '../../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-select-workout',
  templateUrl: './select-workout.component.html',
  styleUrls: ['./select-workout.component.scss'],
})
export class SelectWorkout implements OnInit {
  workoutRoutine: WorkoutRoutine;
  btnIsDisabled = false;
  workouts: Workout[];
  vDuration: VibrateOptions = {
    duration: 1000
  };

  constructor(private alertController: AlertController,
              public authService: FireAuthService) {
  }

  ngOnInit() {
    this.workoutRoutine = this.testData();
    console.log(this.testData());
    const splitName = this.workoutRoutine.weeklyWorkout.splitName;
    if (splitName === 'pushPull' || splitName === 'upperBodyLowerBody') {
      this.workouts = this.organizeWeeklyWorkout(this.workoutRoutine.workoutDays, this.workoutRoutine);
    }

  }

  testData(): WorkoutRoutine {
    return {
      userId: 'CdUNk3tHzOPUlsDOIysAO3oDkwn2',
      span: 2,
      routineStartDate: new Date(),
      routineEndDate: new Date(),
      weeklyWorkout: {
        splitName: 'pushPull',
        workoutA: {
          workoutName: 'Workout A: Push',
          workoutExercises: [
            {
              workoutExercise: {
                name: 'Wide-grip barbell curl',
                type: 'strength',
                muscle: 'biceps',
                equipment: 'barbell',
                difficulty: 'beginner',
                // eslint-disable-next-line max-len
                instructions: 'Stand up with your torso upright while holding a barbell at the wide outer handle. The palm of your hands should be facing forward. The elbows should be close to the torso. This will be your starting position. While holding the upper arms stationary, curl the weights forward while contracting the biceps as you breathe out. Tip: Only the forearms should move. Continue the movement until your biceps are fully contracted and the bar is at shoulder level. Hold the contracted position for a second and squeeze the biceps hard. Slowly begin to bring the bar back to starting position as your breathe in. Repeat for the recommended amount of repetitions.  Variations:  You can also perform this movement using an E-Z bar or E-Z attachment hooked to a low pulley. This variation seems to really provide a good contraction at the top of the movement. You may also use the closer grip for variety purposes.'
              },
              sets: 4,
              reps: 10,
              weight: 50,
              restDuration: 1,
              startExercise: 'undefined',
              endExercise: 'undefined',
              isCompleted: false,
              progressiveOverload: 1
            },
            {
              workoutExercise: {
                name: 'Incline Hammer Curls',
                type: 'strength',
                muscle: 'biceps',
                equipment: 'dumbbell',
                difficulty: 'beginner',
                // eslint-disable-next-line max-len
                instructions: 'Seat yourself on an incline bench with a dumbbell in each hand. You should pressed firmly against he back with your feet together. Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. This will be your starting position. Initiate the movement by flexing at the elbow, attempting to keep the upper arm stationary. Continue to the top of the movement and pause, then slowly return to the start position.'
              },
              sets: 4,
              reps: 10,
              weight: 30,
              restDuration: 1,
              startExercise: 'undefined',
              endExercise: 'undefined',
              isCompleted: false,
              progressiveOverload: 0.5
            }
          ],
          startWorkout: 'undefined',
          endWorkout: 'undefined',
          isCompleted: false,
          note: 'string'
        },
        workoutB: {
          workoutName: 'Workout B: Pull',
          workoutExercises: [
            {
              workoutExercise: {
                name: 'Triceps dip',
                type: 'strength',
                muscle: 'triceps',
                equipment: 'body_only',
                difficulty: 'intermediate',
                // eslint-disable-next-line max-len
                instructions: 'To get into the starting position, hold your body at arms length with your arms nearly locked above the bars. Now, inhale and slowly lower yourself downward. Your torso should remain upright and your elbows should stay close to your body. This helps to better focus on tricep involvement. Lower yourself until there is a 90 degree angle formed between the upper arm and forearm. Then, exhale and push your torso back up using your triceps to bring your body back to the starting position. Repeat the movement for the prescribed amount of repetitions.  Variations: If you are new at this exercise and do not have the strength to perform it, use a dip assist machine if available. These machines use weight to help you push your bodyweight. Otherwise, a spotter holding your legs can help. More advanced lifters can add weight to the exercise by using a weight belt that allows the addition of weighted plates.'
              },
              sets: 3,
              reps: 10,
              weight: 30,
              restDuration: 2,
              startExercise: 'undefined',
              endExercise: 'undefined',
              isCompleted: false,
              progressiveOverload: 1
            },
            {
              workoutExercise: {
                name: 'Dumbbell floor press',
                type: 'powerlifting',
                muscle: 'triceps',
                equipment: 'dumbbell',
                difficulty: 'intermediate',
                // eslint-disable-next-line max-len
                instructions: 'Lay on the floor holding dumbbells in your hands. Your knees can be bent. Begin with the weights fully extended above you. Lower the weights until your upper arm comes in contact with the floor. You can tuck your elbows to emphasize triceps size and strength, or to focus on your chest angle your arms to the side. Pause at the bottom, and then bring the weight together at the top by extending through the elbows.'
              },
              sets: 2,
              reps: 10,
              weight: 20,
              restDuration: 1,
              startExercise: 'undefined',
              endExercise: 'undefined',
              isCompleted: false,
              progressiveOverload: 0.5
            }
          ],
          startWorkout: 'undefined',
          endWorkout: 'undefined',
          isCompleted: false,
          note: 'string'
        },
        workoutFullBody: {
          workoutName: 'Full-Body',
          workoutExercises: [],
          startWorkout: 'undefined',
          endWorkout: 'undefined',
          isCompleted: false,
          note: 'string'
        }
      },
      workoutDays: [true, false, true, false, true, false, false]
    };
  }

  organizeWeeklyWorkout(workoutDays: boolean[], workoutR: WorkoutRoutine) {
    const workouts: Workout[] = [];
    let counter = 0;
    workoutDays.forEach((v, i) => {
      if (v) {
        counter++;
        const w = counter % 2 !== 0 ? this.workoutRoutine.weeklyWorkout.workoutA : this.workoutRoutine.weeklyWorkout.workoutB;
        if (!w.isCompleted) {
          workouts.push(w);
        }
      }
    });
    return workouts;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: 'This is an alert!',
      buttons: ['OK'],
    });

    await alert.present();
  }
}

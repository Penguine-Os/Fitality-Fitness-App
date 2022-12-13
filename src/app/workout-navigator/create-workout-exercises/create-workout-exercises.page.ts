import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import {v4 as uuidv4} from 'uuid';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {FetchExerciseModalComponent} from '../../shared/fetch-exercise-modal/fetch-exercise-modal.component';
import {Router} from '@angular/router';
import {FireAuthService} from '../../Services/Authentication/fire-auth.service';

@Component({
  selector: 'app-create-workout-exercises',
  templateUrl: './create-workout-exercises.page.html',
  styleUrls: ['./create-workout-exercises.page.scss'],
})
export class CreateWorkoutExercisesPage implements OnInit, OnDestroy {
  workoutExercises: WorkoutExercise[] = [];
  #workOutId = uuidv4();
  private ex: ExerciseType[] = [];
  private exerciseSubscription = new Subscription();
  private workoutExerciseSubscription = new Subscription();


  constructor(private modalCtrl: ModalController,
              private stateManagerService: WorkoutExerciseStateManagerService,
              private router: Router,
              public authService: FireAuthService) {
  }

  get exercises(): ExerciseType[] {
    return this.ex;
  }

  set exercises(value: ExerciseType[]) {
    this.ex = value;
  }

  ngOnInit() {
    this.exerciseSubscription = this.stateManagerService.observableExercises
      .subscribe(value => this.ex = value);

    this.workoutExerciseSubscription = this.stateManagerService.observableWorkoutExercises
      .subscribe(value => this.workoutExercises = value);

  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FetchExerciseModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {

      if (data === null) {
        return;
      }

      //this.exercises = [...data];


    }
  }

  accordionHandler(event: any) {
    // <ion-slide-page class=“swiper-no-swiping”>
    // console.log(event.detail.value)
  }

  removeWorkOutExerciseHandler(ex: ExerciseType) {
    this.stateManagerService.deleteExercise(ex);
    this.workoutExercises = this.workoutExercises.filter(x => x.workoutExercise !== ex);

  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
    this.workoutExerciseSubscription.unsubscribe();
  }

  goToNextPage() {
    ////////++++VALIDATIE NOG TE IMPLEMENTEREN++++////////
    console.log(this.workoutExercises);
    this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises', 'create-workout']);
  }


  rangeHandler(event: any, workoutEx: WorkoutExercise) {
    workoutEx.progressiveOverload = event.detail.value / 100;
  }


}

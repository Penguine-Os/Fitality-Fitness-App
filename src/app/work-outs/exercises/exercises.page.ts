import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {FetchExerciseModalComponent} from '../../Components/fetch-exercise-modal/fetch-exercise-modal.component';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import {v4 as uuidv4} from 'uuid';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-fetchedExercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit, OnDestroy{
  get exercises(): ExerciseType[] {
    return this._exercises;
  }

  set exercises(value: ExerciseType[]) {
    this._exercises = value;
  }

  private _exercises: ExerciseType[] = []
  workoutExercises: WorkoutExercise[] = []
  #workOutId = uuidv4();
  private exerciseSubscription = new Subscription()
  private workoutExerciseSubscription = new Subscription()

  constructor(private modalCtrl: ModalController,
              private stateManagerService: WorkoutExerciseStateManagerService) {
  }


  ngOnInit() {
    this.exerciseSubscription  = this.stateManagerService.observableExercises
      .subscribe(value => this._exercises = value)

    this.workoutExerciseSubscription  = this.stateManagerService.observableWorkoutExercises
      .subscribe(value => this.workoutExercises = value)

  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: FetchExerciseModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {

      if (data === null)
        return;

      //this.exercises = [...data];

     // this.mapExerciseTypesToWorkoutExercises();

    }
  }

  mapExerciseTypesToWorkoutExercises() {
    this._exercises.forEach((exVal) => {

      let workoutEx: WorkoutExercise = {
        id: uuidv4(),
        workOutId: this.#workOutId,
        name: '',
        workoutExercise: exVal,
        sets: 0,
        reps: 0,
        weight: 0,
        restDuration: 0,
        getRestsBetweenSets() {
          return this.restDuration === 0 ? [] : new Array(this.sets).fill(this.restDuration)
        },
        startExercise: undefined,
        endExercise: undefined,
        isCompleted: false,
        splitLabel: undefined
      }

      if (!this.workoutExercises.find(x => x.workoutExercise.name === exVal.name))
        this.workoutExercises.push(workoutEx);
    })
  }

  accordionHandler(event: any) {
    // <ion-slide-page class=“swiper-no-swiping”>
    // console.log(event.detail.value)
  }

  removeWorkOutExerciseHandler(ex: ExerciseType) {
    this.stateManagerService.deleteExercise(ex)
    this.workoutExercises = this.workoutExercises.filter(x => x.workoutExercise !== ex)

  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe()
  }
}



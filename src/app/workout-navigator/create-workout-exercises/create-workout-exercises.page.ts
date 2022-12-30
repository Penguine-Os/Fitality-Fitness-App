import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {FetchExerciseModalComponent} from '../../shared/fetch-exercise-modal/fetch-exercise-modal.component';
import {Router} from '@angular/router';
import {FireAuthService} from '../../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-create-workout-exercises',
  templateUrl: './create-workout-exercises.page.html',
  styleUrls: ['./create-workout-exercises.page.scss'],
})
export class CreateWorkoutExercisesPage implements OnInit, OnDestroy {
  workoutExercises: WorkoutExercise[] = [];
  totalReps = 0;
  repsVal: number[] = [];
  private ex: ExerciseType[] = [];
  private exerciseSubscription = new Subscription();
  private workoutExerciseSubscription = new Subscription();
  private repsValSubscription = new Subscription();


  constructor(private modalCtrl: ModalController,
              public stateManagerService: WorkoutExerciseStateManagerService,
              private router: Router,
              public authService: FireAuthService) {
  }

  get exercises(): ExerciseType[] {
    return this.ex;
  }

  set exercises(value: ExerciseType[]) {
    this.ex = value;
  }

  ngOnInit(): void {
    this.exerciseSubscription = this.stateManagerService.observableExercises
      .subscribe(value => this.ex = value);

    this.workoutExerciseSubscription = this.stateManagerService.observableWorkoutExercises
      .subscribe(value => this.workoutExercises = value);

    this.repsValSubscription = this.stateManagerService.observableRepVals
      .subscribe(value => this.repsVal = value);

  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
    this.workoutExerciseSubscription.unsubscribe();
    this.repsValSubscription.unsubscribe();
  }

  public async openModal(): Promise<void> {
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


  public removeWorkOutExerciseHandler(ex: ExerciseType): void {
    this.stateManagerService.deleteExercise(ex);
    //this.workoutExercises = this.workoutExercises.filter(x => x.workoutExercise !== ex);

  }

  public async goToNextPage(): Promise<void> {
    await this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises', 'create-workout']);
  }


  public rangeHandler(event: any, workoutEx: WorkoutExercise): void {
    workoutEx.progressiveOverload = event.detail.value / 100;
  }

  public editReps(repVal: number, index: number): void {
    this.workoutExercises[index].setsAndReps = new Array(this.workoutExercises[index].setsAndReps.length).fill(repVal);
    this.workoutExercises[index].completedSets = new Array(this.workoutExercises[index].setsAndReps.length).fill(false);
  }
}

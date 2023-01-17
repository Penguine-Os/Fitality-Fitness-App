import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {firstValueFrom, map, Subscription} from 'rxjs';
import {FetchExerciseModalComponent} from '../../shared/fetch-exercise-modal/fetch-exercise-modal.component';
import {Router} from '@angular/router';
import {FireAuthService} from '../../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-create-workout-exercises',
  templateUrl: './create-workout-exercises.page.html',
  styleUrls: ['./create-workout-exercises.page.scss'],
})
export class CreateWorkoutExercisesPage implements OnInit, OnDestroy {
  repsVal: number[] = [];
  private repsValSubscription = new Subscription();


  constructor(private modalCtrl: ModalController,
              public stateManagerService: WorkoutExerciseStateManagerService,
              private router: Router,
              public authService: FireAuthService) {
  }


  ngOnInit(): void {
    this.repsValSubscription = this.stateManagerService.observableRepVals
      .subscribe(value => this.repsVal = value);

  }

  ngOnDestroy(): void {
    this.repsValSubscription.unsubscribe();
  }

  public async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: FetchExerciseModalComponent,
    });
    await modal.present();
  }


  public removeWorkOutExerciseHandler(exerciseName: string): void {
    this.stateManagerService.deleteExercise(exerciseName);
  }

  public async goToNextPage(): Promise<void> {
    await this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises', 'create-workout']);
  }


  public rangeHandler(event: any, workoutEx: WorkoutExercise): void {
    workoutEx.progressiveOverload = event.detail.value / 100;
  }
  public async editSetsAndReps(index: number): Promise<void> {
    await firstValueFrom<WorkoutExercise[]>(
    this.stateManagerService.observableWorkoutExercises
      .pipe(
        map(w => {
          const length = w[index].setsAndReps.length;
          const initialVal = this.repsVal[index];
          w[index].setsAndReps = new Array<number>(length).fill(initialVal);
          w[index].completedSets = new Array<boolean>(length).fill(false);
          return w;
        })
      )).then(w =>  this.stateManagerService.assignValueToObservable_WorkoutExercises(w));
  }
}

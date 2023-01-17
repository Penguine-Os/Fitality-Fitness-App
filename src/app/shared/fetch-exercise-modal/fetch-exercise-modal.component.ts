import {Component, OnDestroy, OnInit} from '@angular/core';
import {Muscle} from '../../Models/Muscle';
import {ActivityType} from '../../Models/ActivityType';
import {Difficulty} from '../../Models/Difficulty';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ExerciseProviderService} from '../../Services/Api/exercise-provider.service';
import {ExerciseType} from '../../Models/ExerciseType';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {WorkoutExercise} from '../../Models/WorkoutExercise';

@Component({
  selector: 'app-fetch-exercise-modal',
  templateUrl: './fetch-exercise-modal.component.html',
  styleUrls: ['./fetch-exercise-modal.component.scss'],
})
export class FetchExerciseModalComponent implements OnInit, OnDestroy {
  lblColorSuccess = 'success';
  exercisesAreFetched = false;
  name = '';
  muscles = Object.keys(Muscle).map(x => x.charAt(0).toUpperCase() + x.slice(1).split(/(?=[A-Z])/).join(' '));
  activityType = Object.keys(ActivityType).map(x => x.charAt(0).toUpperCase() + x.slice(1).split(/(?=[A-Z])/).join(' '));
  difficulties = Object.keys(Difficulty).map(x => x.charAt(0).toUpperCase() + x.slice(1).split(/(?=[A-Z])/).join(' '));

  activityVal = '';
  muscleVal = '';
  difficultyVal = '';

  apiSubscriptionPiped = new Subscription();
  fetchedExercises: ExerciseType[] = [];
  chosenWorkoutExercises: WorkoutExercise[] = [];
  fetchedWorkoutExercises: WorkoutExercise[] = [];
  chosenExercises: ExerciseType[] = [];

  constructor(private modalCtrl: ModalController,
              private exerciseProvider: ExerciseProviderService,
              private stateManagerService: WorkoutExerciseStateManagerService) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.apiSubscriptionPiped.unsubscribe();
  }

  public async fetchHandler(): Promise<void> {
    this.apiSubscriptionPiped = this.exerciseProvider.getExercises(
      '',
      this.activityVal,
      this.muscleVal,
      this.difficultyVal
    ).subscribe(wOutExercises => {
      this.fetchedWorkoutExercises = wOutExercises;
    });
    //collectionName
  }

  public async cancel(): Promise<void> {
    await this.modalCtrl.dismiss(null, 'cancel');
  }

  public async confirm(): Promise<void> {
    this.stateManagerService.addExercises(this.chosenWorkoutExercises);
    await this.modalCtrl.dismiss(this.chosenExercises, 'confirm');
  }

  public onDifficultyChanged(ev: any): void {
    this.difficultyVal = Object.values(Difficulty)[ev.detail.value.i];
  }

  public onActivityChanged(ev: any): void {
    this.activityVal = Object.values(ActivityType)[ev.detail.value.i];

  }

  public onMuscleChanged(ev: any): void {
    this.muscleVal = Object.values(Muscle)[ev.detail.value.i];

  }


  public dropHandler(event: any): void {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      this.exercisesAreFetched = event.container.data.length >= 0;
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

    }


  }

}

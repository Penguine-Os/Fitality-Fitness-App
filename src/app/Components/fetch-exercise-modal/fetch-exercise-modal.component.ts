import {Component, OnInit} from '@angular/core';
import {Muscle} from '../../Models/Muscle';
import {ActivityType} from '../../Models/ActivityType';
import {Difficulty} from '../../Models/Difficulty';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {ExerciseProviderService} from '../../Services/Api/exercise-provider.service';
import {ExerciseType} from '../../Models/ExerciseType';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-fetch-exercise-modal',
  templateUrl: './fetch-exercise-modal.component.html',
  styleUrls: ['./fetch-exercise-modal.component.scss'],
})
export class FetchExerciseModalComponent implements OnInit {
  exercisesAreFetched = false;
  name: string = '';
  muscles = Object.keys(Muscle).map(x => {

    return x.charAt(0).toUpperCase() + x.slice(1)
      .split(/(?=[A-Z])/).join(' ')

  })
  activityType = Object.keys(ActivityType).map(x => {

    return x.charAt(0).toUpperCase() + x.slice(1)
      .split(/(?=[A-Z])/).join(' ')

  })
  difficulties = Object.keys(Difficulty).map(x => {

    return x.charAt(0).toUpperCase() + x.slice(1)
      .split(/(?=[A-Z])/).join(' ')

  })

  activityVal = '';
  muscleVal = '';
  difficultyVal = '';

  apiSubscription = new Subscription()
  fetchedExercises: ExerciseType[] = [];
  exercises: ExerciseType[] = [];

  constructor(private modalCtrl: ModalController,
              private exerciseProvider: ExerciseProviderService) {

  }

  ngOnInit() {
  }

  async fetchHandler() {
    this.apiSubscription = this.exerciseProvider.getExercises(
      '',
      this.activityVal,
      this.muscleVal,
      this.difficultyVal).subscribe(value => {
      this.fetchedExercises = value;
      this.exercisesAreFetched = true;
    });

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log(this.exercisesAreFetched)
    return this.modalCtrl.dismiss(this.fetchedExercises, 'confirm');
  }

  onDifficultyChanged(ev: any) {
    this.difficultyVal = Object.values(Difficulty)[ev.detail.value.i]
  }

  onActivityChanged(ev: any) {
    this.activityVal = Object.values(ActivityType)[ev.detail.value.i]

  }

  onMuscleChanged(ev: any) {
    this.muscleVal = Object.values(Muscle)[ev.detail.value.i]

  }

  ngOnDestroy() {
    this.apiSubscription.unsubscribe()
  }

  dropHandler(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    console.log(this.exercises)
  }
}

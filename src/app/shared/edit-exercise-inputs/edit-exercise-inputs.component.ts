import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {WorkoutExercise} from '../../Models/WorkoutExercise';
import {FireStoreService} from '../../Services/FireBase/fire-store.service';
import {Workout} from '../../Models/Workout';

@Component({
  selector: 'app-edit-exercise-inputs',
  templateUrl: './edit-exercise-inputs.component.html',
  styleUrls: ['./edit-exercise-inputs.component.scss'],
})
export class EditExerciseInputsComponent implements OnInit {
  workout: Workout;
  wEx: WorkoutExercise;
  wExercises: WorkoutExercise[];
  exSub: Subscription;
  editSets = 0;
  editReps = 0;
  editWeight = 0;
  editRest = 0;
  editProgressiveOverload = 0;
  @Input() index: number;

  constructor(private modalController: ModalController,
              private fireStoreService: FireStoreService,
              private exService: WorkoutExerciseStateManagerService,) {

  }

  ngOnInit(): void {
    this.exSub = this.exService.observableWorkout.subscribe(wVal => {
      this.workout = wVal;
      this.wExercises = wVal.workoutExercises;
      this.wEx = wVal.workoutExercises[this.index];
    });
    this.editSets = this.wEx.setsAndReps.length;
    this.editReps = this.wEx.setsAndReps[0];
    this.editWeight = this.wEx.weight;
    this.editRest = this.wEx.restDuration;
    this.editProgressiveOverload = this.wEx.progressiveOverload;
  }

  ngOnDestroy(): void {
    this.exSub.unsubscribe();
  }

  public dismiss(): void {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    }, 'cancel');

  }

  public rangeHandler(event: any): void {
    this.editProgressiveOverload = event.detail.value / 100;
  }

  public async dismissConfirm(): Promise<void> {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    }, 'confirmed').then(() => this.updateExercise());


  }

  private async updateExercise(): Promise<void>  {
    const newSetsAndReps = new Array(this.editSets).fill(this.editReps);
    this.wEx.weight = this.editWeight;
    this.wEx.setsAndReps = newSetsAndReps;
    this.updateCompletedSets(this.wEx.completedSets, this.wEx.setsAndReps);
    this.exService.generateIterator(this.wExercises);
    await this.fireStoreService.updateWorkout(this.exService.getCollectionName(), this.workout.workoutRoleNr, this.workout);
  }

  private updateCompletedSets(completedSets: boolean[], setsAndRepsArr: number[]): void {
    while (setsAndRepsArr.length > this.wEx.completedSets.length) {
      completedSets.push(false);
    }
    while (setsAndRepsArr.length < this.wEx.completedSets.length) {
      completedSets.pop();
    }
  }
}

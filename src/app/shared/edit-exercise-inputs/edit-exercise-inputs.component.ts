import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import { Subscription} from 'rxjs';
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
  exSub: Subscription;
  editSets = 0;
  editReps = 0;
  editWeight = 0;
  editRest = 0;
  editProgressiveOverload = 0;
  @Input() exerciseIndex: number;
  @Input() workoutId: string;
  @Input() exerciseId: string;


  constructor(private modalController: ModalController,
              private fireStoreService: FireStoreService,
              private stateManagerService: WorkoutExerciseStateManagerService,
              private alertController: AlertController) {

  }

  ngOnInit(): void {
    this.exSub = this.stateManagerService.observableWorkout.subscribe(wVal => {
      this.workout = wVal;
      this.wEx = wVal.workoutExercises[this.exerciseIndex];
    });
    this.initializeFromInputs();
  }

  ngOnDestroy(): void {
    this.exSub.unsubscribe();
  }

  public async dismiss(): Promise<void> {
    await this.modalController.dismiss({
      dismissed: true
    }, 'cancel');

  }

  public async dismissConfirm(): Promise<void> {
    this.modalController.dismiss({
      dismissed: true
    }, 'confirmed').then(() => this.updateExercise());


  }

  public rangeHandler(event: any): void {
    this.editProgressiveOverload = event.detail.value / 100;
  }

  private initializeFromInputs(): void {
    this.editSets = this.wEx.setsAndReps.length;
    this.editReps = this.wEx.setsAndReps[0];
    this.editWeight = this.wEx.weight;
    this.editRest = this.wEx.restDuration;
    this.editProgressiveOverload = this.wEx.progressiveOverload;
  }

  private async updateExercise(): Promise<void> {
    const newSetsAndReps = new Array(this.editSets).fill(this.editReps);
    this.wEx.weight = this.editWeight;
    this.wEx.setsAndReps = newSetsAndReps;
    this.wEx.restDuration = this.editRest;
    this.wEx.progressiveOverload = this.editProgressiveOverload;
    this.updateCompletedSets(this.wEx.completedSets, this.wEx.setsAndReps);
    this.stateManagerService.generateIterator(this.workout.workoutExercises);
    await this.fireStoreService.updateWorkout(this.stateManagerService.getCollectionName(), this.workout.workoutRoleNr, this.workout);
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

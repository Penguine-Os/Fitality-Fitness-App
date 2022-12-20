import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';
import {WorkoutExercise} from '../../Models/WorkoutExercise';

@Component({
  selector: 'app-edit-exercise-inputs',
  templateUrl: './edit-exercise-inputs.component.html',
  styleUrls: ['./edit-exercise-inputs.component.scss'],
})
export class EditExerciseInputsComponent implements OnInit {
  wEx: WorkoutExercise;
  wExercises: WorkoutExercise[];
  exSub: Subscription;
  editSets = 0;
  editReps = 0;
  editWeight = 0;
  @Input() index: number;

  constructor(private modalController: ModalController,
              private exService: WorkoutExerciseStateManagerService) {

  }

  ngOnInit() {
    this.exSub = this.exService.observableWorkout.subscribe(exVal => {
      this.wExercises = exVal.workoutExercises;
      this.wEx = exVal.workoutExercises[this.index];
    });
    this.editSets = this.wEx.setsAndReps.length;
    this.editReps = this.wEx.setsAndReps[0];
    this.editWeight = this.wEx.weight;
  }

  ngOnDestroy() {
    this.exSub.unsubscribe();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    }, 'cancel');

  }

  dismissConfirm() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    }, 'confirmed').then(() => {
      this.updateExercise();
    });

  }

  private updateExercise() {
    const newSetsAndReps = new Array(this.editSets).fill(this.editReps);
    this.wEx.weight = this.editWeight;
    this.wEx.setsAndReps = newSetsAndReps;
    this.updateCompletedSets(this.wEx.setsAndReps );
    this.exService.generateIterator(this.wExercises);
  }
  private updateCompletedSets(setsAndRepsArr: number[]){
    while (setsAndRepsArr.length>this.wEx.completedSets.length){
      this.wEx.completedSets.push(false);
    }
    while (setsAndRepsArr.length<this.wEx.completedSets.length){
      this.wEx.completedSets.pop();
    }
  }
}

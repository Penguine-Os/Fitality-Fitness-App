import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ExerciseType} from '../../Models/ExerciseType';
import {WorkoutExerciseInputComponent} from '../workout-exercise-input/workout-exercise-input.component';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-exercise-info-modal',
  templateUrl: './exercise-info-modal.component.html',
  styleUrls: ['./exercise-info-modal.component.scss'],
})
export class ExerciseInfoModalComponent implements OnInit, OnDestroy {
  ex: ExerciseType;
  exSub: Subscription;
  @Input() index: number;
  constructor(private modalController: ModalController,
              private exServiec: WorkoutExerciseStateManagerService) {

  }

  ngOnInit(): void {
    this.exSub = this.exServiec.observableWorkout.subscribe(exVal=> this.ex = exVal.workoutExercises[this.index].workoutExercise);
  }
  ngOnDestroy(): void {
   this.exSub.unsubscribe();
  }

  public async dismiss(): Promise<void> {
   await this.modalController.dismiss({
      dismissed: true
    });
}}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ExerciseType} from '../../Models/ExerciseType';
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
  @Input() exerciseIndex: number;
  constructor(private modalController: ModalController,
              private stateManagerService: WorkoutExerciseStateManagerService) {

  }

  ngOnInit(): void {
    this.exSub = this.stateManagerService.observableWorkout
      .subscribe(exVal=> {
         this.ex = exVal.workoutExercises[this.exerciseIndex].workoutExercise;
      });
  }
  ngOnDestroy(): void {
   this.exSub.unsubscribe();
  }

  public async dismiss(): Promise<void> {
   await this.modalController.dismiss({
      dismissed: true
    });
}}

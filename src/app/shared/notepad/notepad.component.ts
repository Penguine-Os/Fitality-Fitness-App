import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Workout} from '../../Models/Workout';
import {Subscription} from 'rxjs';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.scss'],
})
export class NotepadComponent implements OnInit, OnDestroy {
  workout: Workout;
  wSub: Subscription;

  constructor(public exService: WorkoutExerciseStateManagerService,
              private modalController: ModalController,) {
  }

  ngOnInit(): void  {
    this.wSub = this.exService.observableWorkout
      .subscribe(x => this.workout = x);
  }

  ngOnDestroy(): void {
    this.wSub.unsubscribe();
  }

 public async dismiss(): Promise<void>  {
  await  this.modalController.dismiss({
      dismissed: true
    });
  }
}

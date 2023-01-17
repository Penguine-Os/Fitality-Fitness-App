import {Component, Input, OnInit} from '@angular/core';
import {Workout} from '../../Models/Workout';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent implements OnInit {

  @Input() workout: Workout;
  @Input() startDate: number;

  constructor(private stateManagerService: WorkoutExerciseStateManagerService) {
  }

  ngOnInit(): void {

  }

  public clickHandler(): void {
    this.stateManagerService.assignValueToObservable_Workout_WorkoutExercises(this.workout);
  }
}

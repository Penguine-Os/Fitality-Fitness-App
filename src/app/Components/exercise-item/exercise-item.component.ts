import {Component, Input, OnInit} from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';

@Component({
  selector: 'app-exercise-item',
  templateUrl: './exercise-item.component.html',
  styleUrls: ['./exercise-item.component.scss'],
})
export class ExerciseItemComponent implements OnInit {
  @Input() exercise: ExerciseType | undefined;
  @Input() lblColor: string | undefined;
  constructor(private stateManagerService: WorkoutExerciseStateManagerService) { }

  ngOnInit() {

  }

}

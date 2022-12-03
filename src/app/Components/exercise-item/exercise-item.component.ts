import {Component, Input, OnInit} from '@angular/core';
import {ExerciseType} from '../../Models/ExerciseType';

@Component({
  selector: 'app-exercise-item',
  templateUrl: './exercise-item.component.html',
  styleUrls: ['./exercise-item.component.scss'],
})
export class ExerciseItemComponent implements OnInit {
  @Input() exercise: ExerciseType | undefined;
  constructor() { }

  ngOnInit() {}

}

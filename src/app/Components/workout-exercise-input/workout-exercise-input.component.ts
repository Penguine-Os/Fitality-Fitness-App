import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-workout-exercise-input',
  templateUrl: './workout-exercise-input.component.html',
  styleUrls: ['./workout-exercise-input.component.scss'],
})
export class WorkoutExerciseInputComponent implements OnInit {
  @Input('propertyName')propertyName = '';
  @Input('propertyValue')propertyValue = 0;

  constructor() { }

  ngOnInit() {}

  increaseClickHandler() {
    this.propertyValue++;
  }

  decreaseClickHandler() {
    this.propertyValue = this.propertyValue <=0 ? 0 : --this.propertyValue;
  }
}

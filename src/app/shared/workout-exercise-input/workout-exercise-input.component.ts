import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-workout-exercise-input',
  templateUrl: './workout-exercise-input.component.html',
  styleUrls: ['./workout-exercise-input.component.scss'],
})
export class WorkoutExerciseInputComponent implements OnInit {
  @Input('propertyName') propertyName = '';
  @Input('propertyValue') propertyValue = 0;
  @Output() propertyValueChange = new EventEmitter<number>();

  @Input() min = Number.MIN_VALUE;
  // @Input() max = Number.POSITIVE_INFINITY;
  @Input() stepSize = 1;
  @Input() smallerStep = 1;
  constructor() {

  }
  ngOnInit() {
  }

  increase() {
    this.resize(this.stepSize);
  }

  decrease() {
    this.resize(-Math.min(this.smallerStep, this.stepSize));
  }

  resize(stepSize: number) {
    this.propertyValue = Math.max(this.min, this.propertyValue + stepSize);
    this.propertyValueChange.emit(this.propertyValue);
  }

  handleChange($event: any) {
    this.propertyValue = Number($event.target.value);
    this.propertyValueChange.emit(this.propertyValue);
  }
}

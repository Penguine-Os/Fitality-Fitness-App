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

  ngOnInit(): void {
  }

  public increase(): void {
    this.resize(this.stepSize);
  }

  public decrease(): void {
    this.resize(-Math.min(this.smallerStep, this.stepSize));
  }

  public handleChange($event: any): void {
    this.propertyValue = Number($event.target.value);
    this.propertyValueChange.emit(this.propertyValue);
  }

  private resize(stepSize: number): void {
    this.propertyValue = Math.max(this.min, this.propertyValue + stepSize);
    this.propertyValueChange.emit(this.propertyValue);
  }

}

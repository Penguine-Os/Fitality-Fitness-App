import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-workout-exercise-input',
  templateUrl: './workout-exercise-input.component.html',
  styleUrls: ['./workout-exercise-input.component.scss'],
})
export class WorkoutExerciseInputComponent implements OnInit {
  @Input('propertyName') propertyName = '';
  @Input('propertyValue') propertyValue = 0;
  @Output() propertyValueChange = new EventEmitter<number>();

  constructor() {

  }



  resize1(delta: number) {
    this.propertyValue = Math.max(0,this.propertyValue +delta );
    this.propertyValueChange.emit(this.propertyValue);
  }
  resize2(delta: number) {
    this.propertyValue =  Math.max(1,this.propertyValue +delta );
    this.propertyValueChange.emit(this.propertyValue);
  }
  // resize3(delta: number) {
  //   this.propertyValue =  Math.max(0,this.propertyValue +delta );
  //   this.propertyValueChange.emit(this.propertyValue);
  // }
  ngOnInit() {
  }

  increaseClickHandler() {
    // this.propertyValue++;

    if (this.propertyName === 'Weight:') {
      this.resize2(+5);
      return;
    }
    this.resize1(+1);
  }

  decreaseClickHandler() {
   if (this.propertyName === 'Month') {
     this.resize2(-1);
     return;
   }

    this.resize1(-1);
    //   this.propertyValue = this.propertyValue <= 1 ? 1 : --this.propertyValue;
    //   return;
    // }
    //
    // this.propertyValue = this.propertyValue <= 0 ? 0 : --this.propertyValue;
  }
}

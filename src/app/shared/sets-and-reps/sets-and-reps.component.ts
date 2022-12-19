import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sets-and-reps',
  templateUrl: './sets-and-reps.component.html',
  styleUrls: ['./sets-and-reps.component.scss'],
})
export class SetsAndRepsComponent implements OnInit {
  @Input('propertyValue') propertyValue;
  @Output() propertyValueChange = new EventEmitter<number>();
  btnFill = 'outline';
  private initialRepVal: number;

  constructor() {
  }

  ngOnInit() {
    this.initialRepVal = this.propertyValue;
   // console.log(this.initialRepVal); // = 5
  }

  decrease() {
    this.resize(-1);
  }

  resize(stepSize: number) {
    this.propertyValue = Math.max(-1, this.propertyValue + stepSize);
    this.propertyValueChange.emit(this.propertyValue);
    this.btnFill = this.propertyValue > 0 ? 'solid' : 'outline';
    this.propertyValue = this.propertyValue >= 0 ? this.propertyValue : this.initialRepVal;
    this.propertyValueChange.emit(this.propertyValue);

  }

  setClickHandler() {
    this.btnFill = 'solid';
    this.decrease();
  }
}

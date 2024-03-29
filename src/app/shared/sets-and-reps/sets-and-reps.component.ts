import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
@Component({
  selector: 'app-sets-and-reps',
  templateUrl: './sets-and-reps.component.html',
  styleUrls: ['./sets-and-reps.component.scss'],
})
export class SetsAndRepsComponent implements OnInit {
  @Input('propertyValue') propertyValue;
  @Input('clickedValue') clickedValue = true;
   @Output() propertyValueChange = new EventEmitter<number>();
   @Output() clickedValueChange = new EventEmitter<boolean>();
  btnFill = 'outline';
  isUnchecked= true;
  private initialRepVal: number;

  constructor() {
  }

  ngOnInit(): void {
    this.initialRepVal = this.propertyValue;
  }
  public setClickHandler(): void {
    // this.btnFill = 'solid';
    this.clickedValueChange.emit(true);

    if (this.isUnchecked){
      this.isUnchecked=false;
      return;
    }
    this.decrease();
  }

  private decrease(): void {
    this.resize(-1);
  }

  private resize(stepSize: number): void {
    this.propertyValue = Math.max(-1, this.propertyValue + stepSize);
  //  this.btnFill = this.propertyValue > 0 ? 'solid' : 'outline';
    this.clickedValue = this.propertyValue > 0 ;
    this.propertyValue = this.propertyValue >= 0 ? this.propertyValue : this.initialRepVal;
    this.isUnchecked = this.propertyValue === this.initialRepVal;
    this.propertyValueChange.emit(this.propertyValue);
    this.clickedValueChange.emit(this.clickedValue);

  }

}

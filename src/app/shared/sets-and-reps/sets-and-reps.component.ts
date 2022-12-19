import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkoutExerciseStateManagerService} from '../../Services/workout-exercise-state-manager.service';

@Component({
  selector: 'app-sets-and-reps',
  templateUrl: './sets-and-reps.component.html',
  styleUrls: ['./sets-and-reps.component.scss'],
})
export class SetsAndRepsComponent implements OnInit {
  @Input('propertyValue') propertyValue;
  @Input('checkStyleValue') checkStyleValue;
   @Output() propertyValueChange = new EventEmitter<number>();
   @Output() checkStyleValueChange = new EventEmitter<string>();
  btnFill = 'outline';
  isUnchecked= true;
  private initialRepVal: number;

  constructor(private exStateService: WorkoutExerciseStateManagerService) {
  }

  ngOnInit() {
    this.initialRepVal = this.propertyValue;
  }

  decrease() {
    this.resize(-1);
  }

  resize(stepSize: number) {
    this.propertyValue = Math.max(-1, this.propertyValue + stepSize);
    this.btnFill = this.propertyValue > 0 ? 'solid' : 'outline';
    this.propertyValue = this.propertyValue >= 0 ? this.propertyValue : this.initialRepVal;
    this.isUnchecked = this.propertyValue === this.initialRepVal;
    this.checkStyleValue = this.btnFill;
    this.checkStyleValueChange.emit(this.checkStyleValue);
    this.propertyValueChange.emit(this.propertyValue);

  }

  setClickHandler() {
    this.btnFill = 'solid';
    if (this.isUnchecked){
      this.isUnchecked=false;
      this.checkStyleValue = 'solid';
      this.checkStyleValueChange.emit(this.checkStyleValue);
      return;
    }
    this.decrease();
  }
}

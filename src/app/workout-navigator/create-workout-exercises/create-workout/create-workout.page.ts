import {Component, OnInit} from '@angular/core';
import {WorkoutFrequency} from '../../../Models/WorkoutFrequency';
import {MatSliderModule} from '@angular/material/slider';
import {FireAuthService} from '../../../Services/Authentication/fire-auth.service';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit {

  weekdays: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  trainingDays: WorkoutFrequency = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };
  weekRoutine: boolean[] = Object.values(this.trainingDays);
  progressiveOverload: number;
  duration = 1;

  constructor(public authService: FireAuthService) {
  }

  ngOnInit() {
  }

  rangeHandler(event: any) {
    this.progressiveOverload = event.detail.value / 100;
  }

  checkHandler(event: any) {
    console.log(this.trainingDays);
    console.log(this.weekRoutine);
  }


}

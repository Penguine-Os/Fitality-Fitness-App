import { Component, OnInit } from '@angular/core';
import {WorkoutFrequency} from '../../../Models/WorkoutFrequency';

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit {

  weekdays : string[] =['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  trainingDays: WorkoutFrequency = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  }
  weekRoutine: boolean[]= Object.values(this.trainingDays)
  maxOverload: number = 0.5;
  duration: number = 1;

  constructor() { }

  ngOnInit() {
  }

  rangeHandler(event: any) {

    event.detail.value =    event.detail.value/100
     console.log(event.detail.value)
     console.log(this.maxOverload)

  }

  checkHandler(event: any) {
    console.log(this.trainingDays)
    console.log(this.weekRoutine)
  }
}

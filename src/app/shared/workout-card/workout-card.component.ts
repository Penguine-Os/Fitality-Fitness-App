import {Component, Input, OnInit} from '@angular/core';
import {Workout} from '../../Models/Workout';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent implements OnInit {

 @Input() workout: Workout;
  constructor() { }

  ngOnInit() {}

}

import {Component, OnInit} from '@angular/core';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';

import {FireAuthService} from '../Services/FireBase/fire-auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  constructor(public stateManagerService: WorkoutExerciseStateManagerService,
              public authService: FireAuthService,) {
  }

  ngOnInit(): void {
  }
}

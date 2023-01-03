import {Component} from '@angular/core';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';
@Component({
  selector: 'app-workout-navigator',
  templateUrl: './workout-navigator.page.html',
  styleUrls: ['./workout-navigator.page.scss'],
})
export class WorkoutNavigatorPage {

  constructor(public authService: FireAuthService) {

  }


}

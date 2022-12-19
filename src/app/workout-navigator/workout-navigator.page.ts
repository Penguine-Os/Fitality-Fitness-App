import {Component, OnInit} from '@angular/core';
import {ExerciseProviderService} from '../Services/Api/exercise-provider.service';
import {Router} from '@angular/router';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';
import {FireAuthService} from '../Services/FireBase/fire-auth.service';



@Component({
  selector: 'app-workout-navigator',
  templateUrl: './workout-navigator.page.html',
  styleUrls: ['./workout-navigator.page.scss'],
})
export class WorkoutNavigatorPage implements OnInit {

  constructor(private stateManagerService: WorkoutExerciseStateManagerService,
              private router: Router, public authService: FireAuthService) {

  }

  ionViewWillEnter() {
    if (this.stateManagerService.getWorkoutExercises().length <= 0) {
      this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
    } else {
      this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
    }
    //this.router.navigate(['tabs', 'WorkoutNavTab', 'select-workout']);
  }

  ngOnInit() {
  }


}

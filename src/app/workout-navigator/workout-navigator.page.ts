import {Component, OnInit} from '@angular/core';
import {ExerciseProviderService} from '../Services/Api/exercise-provider.service';
import {Router} from '@angular/router';
import {WorkoutExerciseStateManagerService} from '../Services/workout-exercise-state-manager.service';


@Component({
  selector: 'app-workout-navigator',
  templateUrl: './workout-navigator.page.html',
  styleUrls: ['./workout-navigator.page.scss'],
})
export class WorkoutNavigatorPage implements OnInit {

  constructor(private stateManagerService: WorkoutExerciseStateManagerService, private router: Router) {

  }

  ionViewWillEnter() {
    if (this.stateManagerService.getWorkoutExercises().length <= 0) {
      this.router.navigate(['tabs', 'WorkoutNavTab', 'create-workout-exercises']);
    } else {
      this. router.navigate(['tabs', 'WorkoutNavTab', 'start-workout']);
    }
  }

  ngOnInit() {
  }

}

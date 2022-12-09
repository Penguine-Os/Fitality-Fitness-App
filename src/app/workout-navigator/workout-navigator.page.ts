import { Component, OnInit } from '@angular/core';
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
    if (stateManagerService.getWorkoutExercises().length <= 0 )
    router.navigate(['tabs','WorkoutNavTab','create-workout-exercises'])
    else
      router.navigate(['tabs','WorkoutNavTab','start-workout'])
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {ExerciseProviderService} from '../Services/Api/exercise-provider.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-work-outs',
  templateUrl: './work-outs.page.html',
  styleUrls: ['./work-outs.page.scss'],
})
export class WorkOutsPage implements OnInit {
// public Exercises = new  Observable<ExerciseType[]>;

  constructor(private exerciseProviderService: ExerciseProviderService, private router: Router) {
//conditie
  //  router.navigate([''])
  }

 async ngOnInit() {
  // this.Exercises = this.exerciseProviderService.getExercises('','','chest','Beginner');

 }

}

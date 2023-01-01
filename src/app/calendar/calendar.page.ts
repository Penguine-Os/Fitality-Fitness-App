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

  async ngOnInit(): Promise<void> {
    // await this.fireStoreService.getAllRoutineWorkoutsGroupedByWeek()
    //   .then(x=> this.groupedWorkoutSubs = x.subscribe( y => {
    //     const [key, value]= y;
    //     this.groupedWorkouts.push(value);
    //   })).then(()=> {
    //     this.groupedWorkouts.slice(1);
    //     console.log(this.groupedWorkouts);
    //   });
   // const observableGroupedWorkouts  = this.fireStoreService.getAllRoutineWorkoutsGroupedByWeek();
   //   this.groupedWorkoutSubs = observableGroupedWorkouts
   //     .pipe(
   //       map(w => w.map(wo => wo.startWorkoutTimeStamp)),
   //       groupBy(startDate => moment(startDate.))
   //     ).subscribe();
    // await this.fireStoreService.getAllRoutineWorkoutsGroupedByWeek()
    //   .then(x=> this.groupedWorkoutSubs = x.subscribe( y => {
    //     const [key, value]= y;
    //     this.groupedWorkouts.push(value);
    //   })).then(()=> {
    //     this.groupedWorkouts.slice(1);
    //     console.log(this.groupedWorkouts);
    //   });
  // await firstValueFrom(this.fireStoreService.getAllRoutineWorkoutsGroupedByWeek())
  //   .then(x => {
  //     const source=from(x);
  //     return source.pipe(
  //       groupBy(workout => moment(workout.startWorkoutTimeStamp.toDate()).week()),
  //       mergeMap(group=> zip(of(group.key), group.pipe(toArray())))
  //     );
  //   }).then(x => x.subscribe(y => console.log(y)));
  }

}

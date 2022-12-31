import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ExerciseType} from '../../Models/ExerciseType';
import {environment} from '../../../environments/environment';
import {WorkoutExercise} from '../../Models/WorkoutExercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseProviderService {

  readonly baseUrl = 'https://api.api-ninjas.com/v1/exercises';

  constructor(private httpClient: HttpClient) {
  }

 public getExercises(name: string = '',
               type: string = '',
               muscle: string = '',
               difficulty: string = ''): Observable<WorkoutExercise[]> {
    return this.httpClient.get<ExerciseType[]>(
      this.baseUrl,
      {
        responseType: 'json',
        params: {
          name,
          type,
          muscle,
          difficulty
        },
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'X-Api-Key': `${environment.exerciseApiKey}`
        },
      }
    ).pipe(
      map( exercises =>{
        const workoutsEx: WorkoutExercise[]=[];
        exercises.forEach( exType => {
          const wex: WorkoutExercise={
            completedSets: [false],
            endExerciseTimeStamp: 0,
            isCompleted: false,
            progressiveOverload: 0.5,
            restDuration: 1,
            setsAndReps: [1],
            startExerciseTimeStamp: 0,
            weight: 15,
            workoutExercise: exType
          };
          workoutsEx.push(wex);
        });
        return workoutsEx;
      })
    );

  }
}

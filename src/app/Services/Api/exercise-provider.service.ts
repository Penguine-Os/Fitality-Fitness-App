import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExerciseType} from '../../Models/ExerciseType';
import {environment} from '../../../environments/environment';
import {WorkoutEx} from '../../Models/WorkoutEx';

@Injectable({
  providedIn: 'root'
})
export class ExerciseProviderService {

  readonly baseUrl = 'https://api.api-ninjas.com/v1/exercises';

  constructor(private httpClient: HttpClient) {
  }

  getExercises(name: string = '',
               type: string = '',
               muscle: string = '',
               difficulty: string = ''): Observable<ExerciseType[]> {
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
    );

  }


  getExercisesV2(name: string = '',
                 type: string = '',
                 muscle: string = '',
                 difficulty: string = ''): Observable<WorkoutEx<ExerciseType>[]> {
    return this.httpClient.get<WorkoutEx<ExerciseType>[]>(
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
    ).pipe();

  }
}

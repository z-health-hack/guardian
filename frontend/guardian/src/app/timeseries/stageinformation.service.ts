import {Injectable} from '@angular/core';
import {DATAPOINTS_URL, PATIENTS_URL, TIME_SERIES_URL} from '../endpoints';
import {DataPoint, Timeseries} from './timeseries.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {UserProfileService} from '../auth/user-profile.service';
import {StageInformation} from './stageinformation.model';


@Injectable({
  providedIn: 'root'
})
export class StageInformationService {


  constructor(private httpClient: HttpClient, private profileService: UserProfileService) {

  }

  getStateInformation(patientId): Observable<StageInformation> {
    return this.httpClient.get<StageInformation>(`${PATIENTS_URL}/${patientId}/stage`);
  }
}

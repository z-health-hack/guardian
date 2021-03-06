import {Injectable} from '@angular/core';
import {DATAPOINTS_URL, DELETE_ALL_TIME_SERIES_URL, TIME_SERIES_URL} from '../endpoints';
import {DataPoint, Timeseries} from './timeseries.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {UserProfileService} from '../auth/user-profile.service';


@Injectable({
  providedIn: 'root'
})
export class TimeseriesService {

  typeIDMap = {};

  constructor(private httpClient: HttpClient, private profileService: UserProfileService) {

  }

  getAll(): Observable<Timeseries[]> {
    return this.httpClient.get<Timeseries[]>(TIME_SERIES_URL)
      .pipe(tap(ts => this.storeTimeSeries(ts)));
  }

  storeTimeSeries(ts: Timeseries[]): void {
    this.profileService.userProfile$.subscribe(up => {
      for (const t of ts) {
        if (t.owner.id === up.id) {
          this.typeIDMap[t.time_series_type] = t.id;
        }
      }
    });
  }

  getForOwner(owner: string): Observable<Timeseries[]> {
    return this.httpClient.get<Timeseries[]>(`${TIME_SERIES_URL}?owner=${owner}`);
  }

  getById(id: number): Observable<Timeseries> {
    return this.httpClient.get<Timeseries>(`${TIME_SERIES_URL}/${id}`);
  }

  postTimeSeries(type: string, description: string): Observable<Timeseries> {
    const ts = {
      time_series_type: type,
      description
    };
    return this.httpClient.post<Timeseries>(TIME_SERIES_URL, ts);
  }

  deleteAll(): Observable<void> {
    return this.httpClient.delete<void>(DELETE_ALL_TIME_SERIES_URL);
  }

  pushValue(timeSeriesId, date, value): Observable<DataPoint> {
    const dataPoint = {
      time_series_id: timeSeriesId,
      time_stamp: date.toDate(),
      value
    };
    return this.httpClient.post<DataPoint>(DATAPOINTS_URL, dataPoint);
  }
}

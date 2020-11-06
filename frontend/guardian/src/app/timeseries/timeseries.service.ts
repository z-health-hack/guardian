import {Injectable} from '@angular/core';
import {TIME_SERIES_URL} from '../endpoints';
import {Timeseries} from './timeseries.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TimeseriesService {

  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Timeseries[]> {
    return this.httpClient.get<Timeseries[]>(TIME_SERIES_URL);
  }

  getById(id: number): Observable<Timeseries> {
    return this.httpClient.get<Timeseries>(`${TIME_SERIES_URL}/${id}`);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PATIENTS_URL} from '../endpoints';
import {UserProfile} from '../auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {


  constructor(private httpClient: HttpClient) {
  }

  public getPatients(): Observable<UserProfile[]> {
    return this.httpClient.get<UserProfile[]>(PATIENTS_URL);
  }

  public getPatientById(id: string): Observable<UserProfile> {
    return this.httpClient.get<UserProfile>(`${PATIENTS_URL}/${id}`);
  }
}

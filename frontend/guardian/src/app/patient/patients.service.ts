import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PATIENTDETAILS_URL, PATIENTS_URL} from '../endpoints';
import {PatientDetail, UserProfile} from '../auth/auth.model';

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

  public getPatientDetailsById(id: string): Observable<PatientDetail> {
    return this.httpClient.get<PatientDetail>(`${PATIENTDETAILS_URL}/${id}`);
  }
}

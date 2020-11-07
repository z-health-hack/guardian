import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {PatientsService} from '../patients.service';
import {UserProfile} from '../../auth/auth.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  public patients: UserProfile[] = [];

  constructor(
    private router: Router,
    private patientsService: PatientsService,
  ) {
  }

  ngOnInit(): void {
    this.patientsService.getPatients()
      .subscribe(patients => {
        this.patients = patients;
        if (patients.length === 1) {
          this.router.navigate([`/patients/detail/${patients[0].id}`]);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

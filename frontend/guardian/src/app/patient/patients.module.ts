import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PatientListComponent} from './patient-list/patient-list.component';
import {PatientDetailComponent} from './patient-detail/patient-detail.component';
import {PatientsRoutingModule} from './patients-routing.module';


@NgModule({
  declarations: [PatientListComponent, PatientDetailComponent],
  imports: [
    PatientsRoutingModule,
    CommonModule
  ]
})
export class PatientsModule {
}

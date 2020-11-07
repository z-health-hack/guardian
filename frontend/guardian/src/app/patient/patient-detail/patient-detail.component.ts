import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject, from, Observable, Subject, timer} from 'rxjs';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';
import {TimeseriesService} from '../../timeseries/timeseries.service';
import {Timeseries} from '../../timeseries/timeseries.model';
import {Plotly} from 'angular-plotly.js/lib/plotly.interface';
import {PatientsService} from '../patients.service';
import {PatientDetail, UserProfile} from '../../auth/auth.model';
import {StageInformation} from '../../timeseries/stageinformation.model';
import {StageInformationService} from '../../timeseries/stageinformation.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  private id = '?';

  private data = new BehaviorSubject<Timeseries[]>([]);

  public patient: UserProfile;
  public patientDetail: PatientDetail;

  public bloodOxygen: Plotly.Data[] = [];
  public heartRate: Plotly.Data[] = [];
  public strength: Plotly.Data[] = [];
  public mobility: Plotly.Data[] = [];

  public stageInformation: StageInformation;

  constructor(
    private route: ActivatedRoute,
    private timeseriesService: TimeseriesService,
    private patientsService: PatientsService,
    private stageInformationService: StageInformationService
  ) {
  }

  private static toPlotly(ts: Timeseries): Plotly.Data[] {
    return [{x: ts.data_points.map(d => d.time_stamp), y: ts.data_points.map(d => d.value)}];
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => this.setId(params.get('id')));

    timer(0, 3000)
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap(() => this.timeseriesService.getForOwner(this.id)))
      .subscribe(ts => this.data.next(ts));

    timer(0, 3000)
      .pipe(
        takeUntil(this.unsubscribe$),
        mergeMap(() => this.stageInformationService.getStateInformation(this.id)))
      .subscribe(si => {
        this.stageInformation = si;
        console.log(si);
      });

    this.run('bloodOxygen').subscribe(data => {
      this.bloodOxygen = data;
    });
    this.run('heartRate').subscribe(data => this.heartRate = data);
    this.run('strength').subscribe(data => this.strength = data);
    this.run('mobility').subscribe(data => this.mobility = data);
  }

  private setId(id: string): void {
    this.id = id;
    this.patientsService.getPatientById(id)
      .subscribe(patient => this.patient = patient);
    this.patientsService.getPatientDetailsById(id)
      .subscribe(patientDetail => this.patientDetail = patientDetail);
  }

  get getId(): string {
    return this.id;
  }

  run(type: string): Observable<Plotly.Data[]> {
    return this.data.asObservable()
      .pipe(
        mergeMap(ts => from(ts)),
        filter(d => d.time_series_type === type),
        map(d => PatientDetailComponent.toPlotly(d)));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

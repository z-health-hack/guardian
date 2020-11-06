import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  private id = '?';
  public stepsData = [{ x: [1, 2, 3], y: [2, 6, 3] }];
  public strengthData = [{ x: [1, 2, 3], y: [2, 6, 3] }];
  public heartRateData = [{ x: [1, 2, 3], y: [2, 6, 3] }];
  public bloodOxyData = [{ x: [1, 2, 3], y: [2, 6, 3] }];

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  get getId(): string {
    return this.id;
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => this.id = params.get('id'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

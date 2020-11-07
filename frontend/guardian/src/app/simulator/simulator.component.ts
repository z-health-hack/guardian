import { Component, OnInit } from '@angular/core';
import {timer} from 'rxjs';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import {TimeseriesService} from '../timeseries/timeseries.service';

import * as moment from 'moment';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  public currentDay;
  private currentIndex = 0;
  private days = [];
  constructor(private timeseriesService: TimeseriesService) {
    this.timeseriesService.getAll().subscribe();
  }

  ngOnInit(): void {
    this.createDays();
  }

  animateDays(): void {
    const subscription = timer(0, 500)
      .subscribe(x => {
        if (this.currentIndex < this.days.length) {
          this.currentDay = this.days[this.currentIndex++];
          this.timeseriesService.pushValue('strength',
            this.currentDay.day,
            this.currentDay.steps).subscribe();
        } else {
          subscription.unsubscribe();
        }
      });
  }

  createDays(): void {
    const totalDays = 700;
    const maxSteps = 1200;
    const steps = this.simulateSteps(maxSteps, 344, totalDays);

    const today = moment('2020-01-04');
    for (let i = 0; i < totalDays; i++) {
      this.days.push({
        day: today.clone().add(i, 'days'),
        steps: steps[i],
        steps_max: maxSteps
      });
    }
  }

  simulateSteps(startValue, zeroOutDay, endDay): number[]  {
    const delta = (startValue / zeroOutDay) * -1;

    const y = [];
    for (let i = 0; i < endDay; i++) {
      let value = startValue + i * delta;
      const randomValue = this.random(-0.2 * value, 0.2 * value);
      value += randomValue;
      value = value > 0 ? value : 0;
      value = Math.round(value);
      y.push(value);
    }

    return y;
  }

  random(min, max): number {
    return Math.random() * (max - min) + min;
  }
}

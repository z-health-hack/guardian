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

  public firstDate;
  public currentDay;
  private currentIndex = 0;
  private days = [];
  constructor(private timeseriesService: TimeseriesService) {
    this.timeseriesService.getAll().subscribe(ts => {
      this.checkAndCreateTs('strength', 'Hand strength');
      this.checkAndCreateTs('mobility', 'Walked steps in on go');
      this.checkAndCreateTs('heartRate', 'Average Heart Rate over one Day');
      this.checkAndCreateTs('bloodOxygen', 'Blood Oxygen level');
    });
  }

  checkAndCreateTs(type: string, description: string): void {
    if (type in this.timeseriesService.typeIDMap) {
      return;
    }

    this.timeseriesService.postTimeSeries(type, description).subscribe(x => {
      this.timeseriesService.getAll().subscribe();
    });
  }

  ngOnInit(): void {
    this.createDays();
  }

  animateDays(): void {
    const subscription = timer(0, 500)
      .subscribe(x => {
        if (this.currentIndex < this.days.length) {
          this.currentDay = this.days[this.currentIndex++];
          this.timeseriesService.pushValue('mobility',
            this.currentDay.day,
            this.currentDay.step).subscribe();
          this.timeseriesService.pushValue('strength',
            this.currentDay.day,
            this.currentDay.strength).subscribe();
          this.timeseriesService.pushValue('heartRate',
            this.currentDay.day,
            this.currentDay.heartRate).subscribe();
          this.timeseriesService.pushValue('bloodOxygen',
            this.currentDay.day,
            this.currentDay.bloodOxygen).subscribe();
        } else {
          subscription.unsubscribe();
        }
      });
  }

  createDays(): void {
    const totalDays = 700;
    const maxSteps = 1200;
    const maxStrength = 4;
    const maxHeartRate = 75;
    const maxBloodOxygen = 98;
    const steps = this.simulateLinearSteps(maxSteps, 344, totalDays, 0.2);
    const strength = this.simulateLinearSteps(maxStrength, 554, totalDays, 0.2, false);
    const heartRate = this.simulateLinearSteps(maxHeartRate, totalDays, totalDays, 0.2);
    const bloodOxygen = this.simulateLinearSteps(maxBloodOxygen, totalDays, totalDays, 0.1);

    const today = moment('2020-01-04');
    this.firstDate = today;
    for (let i = 0; i < totalDays; i++) {
      this.days.push({
        day: today.clone().add(i, 'days'),
        step: steps[i],
        steps_max: maxSteps,
        strength: strength[i],
        strength_max: maxStrength,
        heartRate: heartRate[i],
        heartRate_max: maxHeartRate,
        bloodOxygen: bloodOxygen[i],
        bloodOxygen_max: maxBloodOxygen
      });
    }
  }

  simulateLinearSteps(startValue, zeroOutDay, endDay, variant, round= true): number[]  {
    const delta = (startValue / zeroOutDay) * -1;

    const y = [];
    for (let i = 0; i < endDay; i++) {
      let value = startValue + i * delta;
      const randomValue = this.random(-variant * value, variant * value);
      value += randomValue;
      value = value > 0 ? value : 0;
      if (round) {
        value = Math.round(value);
      } else {
        value = Math.round(value * 100) / 100;
      }
      y.push(value);
    }

    return y;
  }

  random(min, max): number {
    return Math.random() * (max - min) + min;
  }
}

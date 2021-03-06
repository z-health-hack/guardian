import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {TimeseriesService} from '../timeseries/timeseries.service';

import * as moment from 'moment';
import {UserProfileService} from '../auth/user-profile.service';
import {mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit, OnDestroy {

  private timerSubscription: Subscription = null;

  public isRunning = false;
  public firstDate;
  public currentDay;
  private currentIndex = 0;
  private days = [];

  private typeIDMap = {};
  private userId: number;

  constructor(private timeseriesService: TimeseriesService, private profileService: UserProfileService) {
    this.profileService.userProfile$.pipe(
      mergeMap(user => {
        this.userId = user.id;
        return this.timeseriesService.getForOwner(String(user.id));
      })
    ).subscribe(ts => {
      this.typeIDMap = {};
      for (const t of ts) {
        this.typeIDMap[t.time_series_type] = t.id;
      }
      this.checkAndCreateTs('strength', 'Hand strength');
      this.checkAndCreateTs('mobility', 'Walked steps in on go');
      this.checkAndCreateTs('heartRate', 'Average Heart Rate over one Day');
      this.checkAndCreateTs('bloodOxygen', 'Blood Oxygen level');
    });
  }

  checkAndCreateTs(type: string, description: string): void {
    if (type in this.typeIDMap) {
      return;
    }

    this.timeseriesService.postTimeSeries(type, description).subscribe(x => {
      this.typeIDMap[x.time_series_type] = x.id;
    });
  }

  ngOnInit(): void {
    this.createDays();
    this.currentDay = this.days[0];
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  onClick(): void {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.animateDays();
    }
  }

  animateDays(): void {
    this.stopTimer();
    this.timerSubscription = timer(0, 700)
      .subscribe(x => {
        if (this.currentIndex < this.days.length) {
          this.currentDay = this.days[this.currentIndex++];
          this.timeseriesService.pushValue(this.typeIDMap['mobility'],
            this.currentDay.day,
            this.currentDay.step).subscribe();
          this.timeseriesService.pushValue(this.typeIDMap['strength'],
            this.currentDay.day,
            this.currentDay.strength).subscribe();
          this.timeseriesService.pushValue(this.typeIDMap['heartRate'],
            this.currentDay.day,
            this.currentDay.heartRate).subscribe();
          this.timeseriesService.pushValue(this.typeIDMap['bloodOxygen'],
            this.currentDay.day,
            this.currentDay.bloodOxygen).subscribe();
        } else {
          this.stopTimer();
        }
      });
    this.isRunning = true;
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.isRunning = false;
  }

  resetAllData(): void {
    this.stopTimer();
    this.createDays();
    this.timeseriesService.deleteAll().subscribe();
  }

  createDays(): void {
    const totalDays = 700;
    const maxSteps = 10000;
    const maxStrength = 60;
    const maxHeartRate = 75;
    const maxBloodOxygen = 98;
    const steps = this.simulateLinearSteps(maxSteps, 344, totalDays, 0.2);
    const strength = this.simulateLinearSteps(maxStrength, 554, totalDays, 0.2, false);
    const heartRate = this.simulateLinearSteps(maxHeartRate, totalDays, totalDays, 0.2);
    const bloodOxygen = this.simulateLinearSteps(maxBloodOxygen, totalDays, totalDays, 0.1);

    const today = moment('2020-01-04');
    this.firstDate = today;
    this.days = [];
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

  simulateLinearSteps(startValue, zeroOutDay, endDay, variant, round = true): number[] {
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

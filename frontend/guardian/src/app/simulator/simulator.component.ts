import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  random(min, max): number {
    return Math.random() * (max - min) + min;
  }

  // tslint:disable-next-line:typedef
  simulateSteps(startValue, zeroOutDay, endDay)  {
    const today = new Date();
    const delta = (startValue / zeroOutDay) * -1;

    const x = [];
    const y = [];
    for (let i = 0; i < endDay; i++) {
      let value = startValue + i * delta;
      value += this.random(-0.2 * value, -0.2 * value);
      x.push(today.getDate() + i);
      y.push(value);
    }

    return {x, y};
  }

}

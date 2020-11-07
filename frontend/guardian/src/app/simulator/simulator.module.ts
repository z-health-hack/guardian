import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorComponent } from './simulator.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [SimulatorComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SimulatorModule { }

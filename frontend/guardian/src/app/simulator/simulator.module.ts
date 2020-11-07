import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorComponent } from './simulator.component';
import {RouterModule} from '@angular/router';
import {NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [SimulatorComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbProgressbarModule
  ]
})
export class SimulatorModule { }

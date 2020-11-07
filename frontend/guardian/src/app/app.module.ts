import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from './material.module';
import {MatCardModule} from '@angular/material/card';
import {LoginModule} from './login/login.module';
import {SimulatorModule} from './simulator/simulator.module';
import {AuthInterceptor} from "./auth/auth.inteceptor";

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    SimulatorModule,
    FormsModule,
    MaterialModule,
    MatCardModule,
    BrowserAnimationsModule,
    PlotlyModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

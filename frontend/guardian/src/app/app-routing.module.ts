import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SimulatorComponent} from './simulator/simulator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/patients',
    pathMatch: 'full'
  },
  {
    path: 'patients',
    loadChildren: () => import('./patient/patients.module').then(m => m.PatientsModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'simulator',
    component: SimulatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

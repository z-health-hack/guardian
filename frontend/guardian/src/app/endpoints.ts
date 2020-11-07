import {environment} from '../environments/environment';

export const AUTH_URL = `${environment.backendUrl}api-token-auth/`;

export const TIME_SERIES_URL = `${environment.backendUrl}timeseries`;
export const DELETE_ALL_TIME_SERIES_URL = `${environment.backendUrl}delete-all-timeseries`;
export const PATIENTS_URL = `${environment.backendUrl}patients`;
export const PATIENTDETAILS_URL = `${environment.backendUrl}patientsdetail`;
export const DATAPOINTS_URL = `${environment.backendUrl}datapoints`;
export const USER_PROFILE_URL = `${environment.backendUrl}profile/me`;

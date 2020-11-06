export interface Timeseries {
  id: string;
  // tslint:disable-next-line:variable-name
  owner: string;
  // tslint:disable-next-line:variable-name
  time_series_type: string;
  description: string;
  // tslint:disable-next-line:variable-name
  data_points: DataPoint[];
}

export interface DataPoint {
  // tslint:disable-next-line:variable-name
  time_stamp: string;
  value: number;
}

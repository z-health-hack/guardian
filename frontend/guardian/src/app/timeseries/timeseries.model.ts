export interface Timeseries {
  id: string;
  // tslint:disable-next-line:variable-name
  owner: any;
  // tslint:disable-next-line:variable-name
  time_series_type: string;
  description: string;
  // tslint:disable-next-line:variable-name
  data_points: DataPoint[];
}

export interface DataPoint {
  // tslint:disable-next-line:variable-name
  time_series_id: number;
  time_stamp: string;
  value: number;
}

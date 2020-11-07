import datetime
from typing import Optional
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from api.models import Patient
from api.models import TimeSeries
from api.models import DataPoint


class MLMissingTrainDataException(Exception):
    pass


class MLNotTrainedException(Exception):
    pass


class PatientRegressor():
    def __init__(self, patient, time_series_type):
        self.time_series_type: str = time_series_type
        self.patient: Patient = patient
        self.train_data: pd.DataFrame = self._retrieve_data()
        self.model: Optional[LinearRegression] = None
        self.last_data_point: Optional[datetime.datetime] = None

    def _retrieve_data(self):
        wanted_ts = TimeSeries.objects.filter(time_series_type=self.time_series_type, owner=self.patient.user).first()
        query_set = DataPoint.objects.filter(time_series=wanted_ts)\
            .values('value')
        df = pd.DataFrame.from_records(query_set.values('time_stamp', 'value'))
        df['rank'] = list(range(0, len(df)))
        return df

    def fit(self):
        if self.train_data is None:
            raise MLMissingTrainDataException("Train data is missing.")

        self.model = LinearRegression()
        X = np.array(self.train_data['rank']).reshape(-1, 1)
        self.model.fit(X=X, y=self.train_data['value'])
        self.last_data_point = self.train_data['rank'].max()

    def predict(self, n_days=30):
        if not self.model:
            raise MLNotTrainedException("ML model must be trained before prediction is executed.")

        prediction_points = np.array([self.last_data_point + i for i in range(1, n_days+1)]).reshape(-1, 1)
        start_date = self.train_data['time_stamp'].max()

        predicted_values = self.model.predict(prediction_points)
        date_values = [start_date + datetime.timedelta(days=i) for i in range(1, n_days+1)]
        return dict(zip(date_values, predicted_values))

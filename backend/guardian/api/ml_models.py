import datetime
from typing import Optional, Dict, List, Any
from dataclasses import dataclass
import math
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


@dataclass
class ModelPredictions:
    predictions: Any
    variance: int
    current_fitted_value: Any

    @property
    def std(self):
        return math.sqrt(self.variance)


class PatientRegressor:
    def __init__(self, patient, time_series_type):
        self.time_series_type: str = time_series_type
        self.patient: Patient = patient
        self.train_data: pd.DataFrame = self._retrieve_data()
        self.model: Optional[LinearRegression] = None
        self.last_data_point: Optional[datetime.datetime] = None
        self.variance = None
        self.current_fitted_value = None

    def _retrieve_data(self):
        wanted_ts = TimeSeries.objects.filter(time_series_type=self.time_series_type, owner=self.patient).first()
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
        y_fitted = self.model.predict(X)
        self.variance = np.var(self.train_data['value']-y_fitted)
        self.last_data_point = np.array(self.train_data['value'])[-1]
        self.current_fitted_value = y_fitted[-1]

    def predict(self, n_days) -> ModelPredictions:
        if not self.model:
            raise MLNotTrainedException("ML model must be trained before prediction is executed.")

        prediction_points = np.array([self.last_data_point + i for i in range(1, n_days+1)]).reshape(-1, 1)
        start_date = self.train_data['time_stamp'].max()

        predicted_values = self.model.predict(prediction_points)
        date_values = [start_date + datetime.timedelta(days=i) for i in range(1, n_days+1)]
        return ModelPredictions(predictions=dict(zip(date_values, predicted_values)), variance=self.variance, current_fitted_value=self.current_fitted_value)

    def fit_predict_n_days(self, n_days) -> ModelPredictions:
        self.fit()
        return self.predict(n_days)

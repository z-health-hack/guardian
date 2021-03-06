from typing import Optional
import datetime
import math
import logging
from dataclasses import dataclass

from api.ml_models import PatientRegressor, ModelPredictions
from api.models import Stage


@dataclass
class StagePredictionResult:
    current_stage: Stage
    next_stage: Stage
    min_date_until_next_stage: datetime.datetime
    max_date_until_next_stage: datetime.datetime
    predicted_mobility: Optional[ModelPredictions]
    predicted_strength: Optional[ModelPredictions]
    prediction_succeded: bool

    @property
    def expected_days_min(self):
        return self._subtract_datetimes(start_date=datetime.datetime.today(), end_date=self.min_date_until_next_stage)

    @property
    def expected_weeks_min(self):
        return self._transform_days_to_weeks(self.expected_days_min)

    @property
    def expected_days_max(self):
        return self._subtract_datetimes(start_date=datetime.datetime.today(), end_date=self.max_date_until_next_stage)

    @property
    def expected_weeks_max(self):
        return self._transform_days_to_weeks(self.expected_days_max)

    @staticmethod
    def _transform_days_to_weeks(days):
        return math.floor(days/7)

    @staticmethod
    def _subtract_datetimes(start_date, end_date):
        if not isinstance(end_date, datetime.datetime):
            return -1

        return (end_date.replace(tzinfo=None) - start_date.replace(tzinfo=None)).days


def find_threshold(prediction_dict, threshold):
    for k in prediction_dict.keys():
        if prediction_dict[k] <= threshold:
            return k

    return None


def determine_min(values):
    min_val = None
    for val in values:
        if min_val is None or min_val > val:
            min_val = val

    if min_val is None:
        min_val = -1

    return min_val


def determine_min_max_time_until_threshold(prediction_values: ModelPredictions, stage: Stage):
    min_date_until_next_stage = find_threshold(prediction_values.predictions, threshold=stage.threshold_strength + prediction_values.std)
    max_date_until_next_stage = find_threshold(prediction_values.predictions, threshold=stage.threshold_strength - prediction_values.std)

    return {'min': min_date_until_next_stage, 'max': max_date_until_next_stage}


def predict_stages(patient):
    n_days_prediction = 800
    patient_regressor_strength = PatientRegressor(patient=patient, time_series_type='strength')
    patient_regressor_mobility = PatientRegressor(patient=patient, time_series_type='mobility')

    try:
        predicted_values_strength: ModelPredictions = patient_regressor_strength.fit_predict_n_days(
            n_days=n_days_prediction)
        predicted_values_mobility: ModelPredictions = patient_regressor_mobility.fit_predict_n_days(
            n_days=n_days_prediction)

    except KeyError as e:
        logging.warning("No values were provided for ML training.")
        return StagePredictionResult(
            current_stage=Stage.objects.filter(id=1).first(),
            next_stage=Stage.objects.filter(id=2).first(),
            min_date_until_next_stage=datetime.datetime.today(),
            max_date_until_next_stage=datetime.datetime.today(),
            predicted_mobility=None,
            predicted_strength=None,
            prediction_succeded=False
        )

    stages = Stage.objects.order_by('id').all()

    # Find current stage
    current_stage = None
    for stage in stages:
        if predicted_values_mobility.current_fitted_value <= stage.threshold_steps \
                or predicted_values_strength.current_fitted_value <= stage.threshold_strength:
            current_stage = stage

    if current_stage:
        next_stage: Stage = Stage.objects.filter(id=current_stage.id + 1).first()
    else:
        next_stage: Stage = Stage.objects.filter(id=2).first()
        current_stage: Stage = Stage.objects.filter(id=1).first()

    if not next_stage:
        return StagePredictionResult(
            current_stage=current_stage,
            next_stage=current_stage,
            min_date_until_next_stage=0,
            max_date_until_next_stage=0,
            predicted_mobility=predicted_values_mobility,
            predicted_strength=predicted_values_strength,
            prediction_succeded=False
        )

    date_until_next_stage_strength = determine_min_max_time_until_threshold(predicted_values_strength, next_stage)
    date_until_next_stage_mobility = determine_min_max_time_until_threshold(predicted_values_strength, next_stage)

    min_date_until_next_stage = determine_min([date_until_next_stage_strength['min'],
                                               date_until_next_stage_mobility['min']])
    max_date_until_next_stage = determine_min([date_until_next_stage_strength['max'],
                                               date_until_next_stage_mobility['max']])

    stage_prediction_result = StagePredictionResult(
        current_stage=current_stage,
        next_stage=next_stage,
        min_date_until_next_stage=min_date_until_next_stage,
        max_date_until_next_stage=max_date_until_next_stage,
        predicted_mobility=predicted_values_mobility,
        predicted_strength=predicted_values_strength,
        prediction_succeded=True
    )

    return stage_prediction_result

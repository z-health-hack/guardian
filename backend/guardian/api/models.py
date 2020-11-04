from django.db import models
from django.contrib.auth.models import User


class TimeSeries(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    authorized_users = models.ManyToManyField(User, related_name='users')
    description = models.CharField(max_length=512)
    time_series_type = models.CharField(max_length=256)


class DataPoint(models.Model):
    time_series = models.ForeignKey(TimeSeries, null=False, on_delete=models.CASCADE, related_name='data_points')
    time_stamp = models.DateTimeField()
    value = models.FloatField()

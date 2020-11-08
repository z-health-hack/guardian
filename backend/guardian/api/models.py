from django.db import models
from django.contrib.auth.models import User


class TimeSeries(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    authorized_users = models.ManyToManyField(User, related_name='users')
    description = models.CharField(max_length=512)
    time_series_type = models.CharField(max_length=256)

    class Meta:
        unique_together = ('owner', 'time_series_type',)


class DataPoint(models.Model):
    time_series = models.ForeignKey(TimeSeries, null=False, on_delete=models.CASCADE, related_name='data_points')
    time_stamp = models.DateTimeField()
    value = models.FloatField()


class Patient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient')
    date_of_birth = models.DateField()
    date_of_diagnosis = models.DateField()
    emergency_contact = models.CharField(max_length=512)
    address = models.CharField(max_length=512)
    allergies = models.CharField(max_length=512)
    notes = models.CharField(max_length=5000)


class Stage(models.Model):
    id = models.IntegerField(primary_key=True)
    description = models.CharField(max_length=1024)
    suggestions = models.JSONField()
    threshold_steps = models.IntegerField()
    threshold_strength = models.FloatField()

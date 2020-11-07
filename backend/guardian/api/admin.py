from django.contrib import admin
from api.models import TimeSeries, DataPoint, Patient, Stages

admin.site.register(TimeSeries)
admin.site.register(DataPoint)
admin.site.register(Patient)
admin.site.register(Stages)

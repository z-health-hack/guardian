from django.contrib import admin
from api.models import TimeSeries, DataPoint, Patient, Stage

admin.site.register(TimeSeries)
admin.site.register(DataPoint)
admin.site.register(Patient)
admin.site.register(Stage)

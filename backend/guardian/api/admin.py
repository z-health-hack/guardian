from django.contrib import admin
from api.models import TimeSeries, DataPoint

admin.site.register(TimeSeries)
admin.site.register(DataPoint)

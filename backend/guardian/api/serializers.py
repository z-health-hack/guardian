from rest_framework import serializers
from django.contrib.auth.models import User, Group
from api.models import TimeSeries, DataPoint


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TimeSeriesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimeSeries
        fields = ['owner', 'time_series_type', 'description']


class DataPointSerializer(serializers.HyperlinkedModelSerializer):
    time_series_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = DataPoint
        fields = ['time_stamp', 'value', 'time_series_id']

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


class DataPointSerializer(serializers.HyperlinkedModelSerializer):
    time_series_id = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = DataPoint
        fields = ['time_stamp', 'value', 'time_series_id']


class TimeSeriesSerializer(serializers.HyperlinkedModelSerializer):
    data_points = DataPointSerializer(many=True)

    class Meta:
        model = TimeSeries
        fields = ['id', 'owner', 'time_series_type', 'description', 'data_points']

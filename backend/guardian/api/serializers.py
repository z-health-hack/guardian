from rest_framework import serializers
from django.contrib.auth.models import User, Group
from api.models import TimeSeries, DataPoint, Patient


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'url', 'username', 'first_name', 'last_name', 'email', 'groups']


class PatientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Patient
        fields = ['date_of_birth', 'date_of_diagnosis', 'emergency_contact', 'address', 'allergies', 'notes']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class DataPointSerializer(serializers.HyperlinkedModelSerializer):
    time_series_id = serializers.IntegerField(required=True)
    time_stamp = serializers.DateTimeField(required=True)
    value = serializers.FloatField(required=True)

    class Meta:
        model = DataPoint
        fields = ['time_series_id', 'time_stamp', 'value']


class TimeSeriesSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()
    owner = UserSerializer(read_only=True, required=False)
    time_series_type = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    data_points = DataPointSerializer(many=True, required=False)

    class Meta:
        model = TimeSeries
        fields = ['id', 'owner', 'time_series_type', 'description', 'data_points']




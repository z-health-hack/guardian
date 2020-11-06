from django.contrib.auth.models import User, Group
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from api.models import TimeSeries, DataPoint
from api.serializers import UserSerializer, GroupSerializer, TimeSeriesSerializer, DataPointSerializer


class TimeSeriesViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSeriesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TimeSeries.objects.filter(authorized_users__id=user.id).all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DataPointViewSet(viewsets.ModelViewSet):
    serializer_class = DataPointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        timeseries = TimeSeries.objects.filter(authorized_users__id=user.id).all()
        return DataPoint.objects.filter(time_series=timeseries.id).all()

    def perform_create(self, serializer):
        user = self.request.user
        series = TimeSeries.objects.filter(id=serializer.validated_data['time_series_id'],
                                           owner=user)
        if series.exists():
            raise PermissionDenied(detail='Time series not owned by you')

        serializer.save()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

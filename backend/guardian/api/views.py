from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from api.models import TimeSeries, DataPoint
from django.contrib.auth.models import User, Group
from api.serializers import UserSerializer, GroupSerializer, TimeSeriesSerializer, DataPointSerializer


class TimeSeriesViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSeriesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return TimeSeries.objects.filter(authorized_users__id=user.id).all()


class DataPointViewSet(viewsets.ModelViewSet):
    serializer_class = DataPointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        timeseries = TimeSeries.objects.filter(authorized_users__id=user.id).all()
        return DataPoint.objects.filter(time_series=timeseries.id).all()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

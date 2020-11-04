from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from api.models import TimeSeries, DataPoint
from django.contrib.auth.models import User, Group
from api.serializers import UserSerializer, GroupSerializer, TimeSeriesSerializer, DataPointSerializer


class TimeSeriesViewSet(viewsets.ModelViewSet):
    queryset = TimeSeries.objects.all().order_by('id')
    serializer_class = TimeSeriesSerializer
    permission_classes = [permissions.IsAuthenticated]


class DataPointViewSet(viewsets.ModelViewSet):
    queryset = DataPoint.objects.all().order_by('id')
    serializer_class = DataPointSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

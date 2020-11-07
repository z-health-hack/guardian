from django.contrib.auth.models import User, Group
from django.http import JsonResponse
from rest_framework import permissions
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from api.models import TimeSeries, DataPoint, Patient
from api.serializers import UserSerializer, GroupSerializer, TimeSeriesSerializer, DataPointSerializer, \
    PatientSerializer

from api.stage_prediction import predict_stages


class TimeSeriesViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSeriesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        owner = self.request.query_params.get('owner', None)

        if owner:
            return TimeSeries.objects.filter(authorized_users__id=user.id, owner=owner).all()
        else:
            return TimeSeries.objects.filter(authorized_users__id=user.id).all()

    def perform_create(self, serializer):
        ts: TimeSeries = serializer.save(owner=self.request.user)

        ts.authorized_users.add(self.request.user)
        ts.authorized_users.add(User.objects.get(id=1))  # hack
        ts.authorized_users.add(User.objects.get(id=2))  # hack
        ts.authorized_users.add(User.objects.get(id=3))  # hack
        ts.authorized_users.add(User.objects.get(id=4))  # hack
        ts.save()


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
        if not series.exists():
            raise PermissionDenied(detail='Time series not owned by you')

        serializer.save()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class PatientDetailViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, pk=None):
        patients = Patient.objects.filter(user_id=pk).all()

        serializer = PatientSerializer(instance=patients[0],
                                       context={'request': request})
        return Response(serializer.data)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PatientViewSet.get_patients_for_user(user.id)

    @staticmethod
    def get_patients_for_user(user_id):
        owners_of_viewable_series = TimeSeries.objects \
            .filter(authorized_users__id=user_id) \
            .values_list('owner', flat=True) \
            .distinct()

        return User.objects.filter(pk__in=owners_of_viewable_series).all()


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request):
        serializer = UserSerializer(instance=request.user, context={'request': request})
        return Response(serializer.data)


class StageViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_stage(request, patient_id):
    patient = PatientViewSet.get_patients_for_user(request.user.id).get(id=patient_id)

    stage_prediction_results = predict_stages(patient)

    return JsonResponse({
        'current_stage': stage_prediction_results.current_stage.id,
        'next_stage': stage_prediction_results.next_stage.id,
        'expected_days_min': stage_prediction_results.expected_weeks_min,
        'expected_days_max': stage_prediction_results.expected_weeks_max,
        'suggestions': stage_prediction_results.next_stage.suggestions
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_my_profile(request):
    serializer = UserSerializer(instance=request.user, context={'request': request})
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_all_timeseries(request):
    DataPoint.objects.filter(time_series__in=TimeSeries.objects.filter(owner=request.user)).all().delete()
    return Response()


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

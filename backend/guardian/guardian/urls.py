"""guardian URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views as authtoken_views
from api import views as api_views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', api_views.UserViewSet)
router.register(r'patients', api_views.PatientViewSet)
router.register(r'patientsdetail', api_views.PatientDetailViewSet, basename='patientsdetail')
router.register(r'groups', api_views.GroupViewSet)
router.register(r'timeseries', api_views.TimeSeriesViewSet,  basename='timeseries')
router.register(r'datapoints', api_views.DataPointViewSet, basename='datapoints')


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/api-token-auth/', authtoken_views.obtain_auth_token),
    path('api/v1/api-auth/', include('rest_framework.urls')),
    path('api/v1/patients/<int:patient_id>/stage', api_views.get_stage),
    path('api/v1/profile/me', api_views.get_my_profile)
]

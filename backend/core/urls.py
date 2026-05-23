"""
Core URL Configuration for Asteroid Impact Simulator API

Endpoints:
    /simulate/  - POST: Run asteroid impact simulation
    /admin/     - Django admin interface
"""
from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('simulate/', views.simulate_impact, name='simulate_impact'),
]
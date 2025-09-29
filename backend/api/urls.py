# backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_routes),
    path('simulate/', views.simulate_impact),
]
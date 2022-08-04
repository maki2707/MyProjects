from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path(r'delete/me/', views.delete_me, name='delete_me'),
    path(r'delete/<int:id>/', views.delete, name='delete'),
    path('getAll/', views.get_all, name='getAll'),
    path('get/<int:id>/', views.get, name='get'),
    path(r'update/', views.update_user_data, name='update'),
]

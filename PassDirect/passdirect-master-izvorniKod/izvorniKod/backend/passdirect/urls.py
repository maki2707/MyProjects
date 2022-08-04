import djoser
from django.urls import path, include, re_path
from django.views.generic import TemplateView



urlpatterns = [
    path('base/', include('base.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path(r'users/', include('users.urls')),
]

#urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
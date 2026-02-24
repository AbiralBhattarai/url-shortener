from django.urls import path
from .views import *
urlpatterns = [
    path('api/shorten/', CreateShortURLView.as_view(),name='create_short_url'),
]
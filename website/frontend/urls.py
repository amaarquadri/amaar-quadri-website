from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='frontend-index'),
    path('games', views.games, name='frontend-games'),
    path('connect4', views.connect4, name='frontend-connect4'),
]
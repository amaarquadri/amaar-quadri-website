from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='frontend-index'),
    path('aquadrone-mechanical', views.aquadrone_mechanical, name='aquadrone-mechanical'),
    path('sunnybrook', views.sunnybrook, name='sunnybrook'),
    path('tigercat', views.tigercat, name='tigercat'),
    path('games', views.games, name='frontend-games'),
    path('play', views.play, name='frontend-play'),
]

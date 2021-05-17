from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='frontend-index'),
    path('aquadrone-mechanical', views.aquadrone_mechanical, name='aquadrone-mechanical'),
    path('aquadrone-software', views.aquadrone_software, name='aquadrone-software'),
    path('sunnybrook', views.sunnybrook, name='sunnybrook'),
    path('tigercat', views.tigercat, name='tigercat'),
    path('machine-learning', views.machine_learning, name='machine-learning'),
    path('website', views.website, name='website'),
    path('games', views.games, name='frontend-games'),
    path('play', views.play, name='frontend-play'),
    path('connect4', views.connect4, name='frontend-connect4-redirect')
]

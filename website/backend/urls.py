from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

urlpatterns = staticfiles_urlpatterns() + [
    path('post-statistic', views.post_statistic, name='backend-post-statistic'),
    path('post-comment', views.post_comment, name='backend-post-comment')
]

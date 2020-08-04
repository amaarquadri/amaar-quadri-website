from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')


def games(request):
    return render(request, 'frontend/games.html')


def connect4(request):
    return render(request, 'frontend/connect4.html')

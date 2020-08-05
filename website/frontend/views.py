from django.shortcuts import render


def index(request):
    return render(request, 'frontend/index.html')


def games(request):
    return render(request, 'frontend/games.html')


def play(request):
    return render(request, 'frontend/play.html')

from django.shortcuts import render
import json


def index(request):
    return render(request, 'frontend/index.html')


def games(request):
    return render(request, 'frontend/games.html')


def play(request):
    urlParameters = {
        'game': request.GET.get('game', 'connect4'),
        'difficulty': request.GET.get('difficulty', 'medium'),
        'starting-time': request.GET.get('starting-time', None),
        'increment': request.GET.get('increment', None),
        'ai-time': request.GET.get('ai-time', None),
        'ai-positions': request.GET.get('ai-positions', None),
        'log-stats': request.GET.get('log-stats', True)
    }

    if urlParameters['ai-time'] is not None:
        urlParameters['ai-positions'] = None
        urlParameters['starting-time'] = None
        urlParameters['increment'] = None
    elif urlParameters['ai-positions'] is not None:
        urlParameters['starting-time'] = None
        urlParameters['increment'] = None
    elif urlParameters['starting-time'] is not None:
        if urlParameters['increment'] is None:
            urlParameters['increment'] = 10
    elif urlParameters['increment'] is not None:
        urlParameters['starting-time'] = 900
    else:
        urlParameters['ai-time'] = 10

    return render(request, 'frontend/play.html', {'urlParametersJSON': json.dumps(urlParameters)})

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
        # any weird values, or the absence of a value will result in False
        'log-stats': request.GET.get('log-stats', False) == 'true'
    }

    # TODO: handle weird values, number format exception
    if urlParameters['ai-time'] is not None:
        urlParameters['ai-positions'] = None
        urlParameters['starting-time'] = None
        urlParameters['increment'] = None
        urlParameters['ai-time'] = int(urlParameters['ai-time'])
    elif urlParameters['ai-positions'] is not None:
        urlParameters['starting-time'] = None
        urlParameters['increment'] = None
        urlParameters['ai-positions'] = int(urlParameters['ai-positions'])
    elif urlParameters['starting-time'] is not None:
        urlParameters['starting-time'] = int(urlParameters['starting-time'])
        if urlParameters['increment'] is None:
            urlParameters['increment'] = 10
        else:
            urlParameters['increment'] = int(urlParameters['increment'])
    elif urlParameters['increment'] is not None:
        urlParameters['starting-time'] = 900
        urlParameters['increment'] = int(urlParameters['increment'])
    else:
        urlParameters['ai-time'] = 10

    return render(request, 'frontend/play.html', {'urlParametersJSON': json.dumps(urlParameters)})

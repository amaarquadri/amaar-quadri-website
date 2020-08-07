import json
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.apps import apps
GameStatistic = apps.get_model('backend', 'GameStatistic')


def index(request):
    return render(request, 'frontend/index.html')


def games(request):
    return render(request, 'frontend/games.html')


@ensure_csrf_cookie
def play(request):
    urlParameters = clean_url_parameters({
        'game': request.GET.get('game', 'connect4'),
        'difficulty': request.GET.get('difficulty', 'medium'),
        'startingTime': request.GET.get('starting-time', None),
        'increment': request.GET.get('increment', None),
        'aiTime': request.GET.get('ai-time', None),
        'aiPositions': request.GET.get('ai-positions', None),
        # any weird values, or the absence of a value will result in False
        'logStats': request.GET.get('log-stats', False) == 'true'
    })

    query = GameStatistic.objects.filter(difficulty=urlParameters['difficulty']).order_by('-date_played')
    game_statistics = {
        'humanWins': sum([game_statistic.winner == 1 for game_statistic in query]),
        'aiWins': sum([game_statistic.winner == -1 for game_statistic in query]),
        'draws': sum([game_statistic.winner == 0 for game_statistic in query]),
        'comments': [{'comment': game_statistic.comment, 'date': game_statistic.date_played.strftime('%B %d, %Y')}
                     for game_statistic in query if game_statistic.comment != '']
    }

    return render(request, 'frontend/play.html', {
        'urlParametersJSON': json.dumps(urlParameters),
        'gameStatisticsJSON': json.dumps(game_statistics)
    })


def clean_url_parameters(urlParameters):
    for param in ['aiTime', 'aiPositions', 'startingTime', 'increment']:
        if urlParameters[param] is not None:
            try:
                urlParameters[param] = int(urlParameters[param])
                # every param must be positive except for increment which must be non-negative
                if urlParameters[param] < 0 if param == 'increment' else urlParameters[param] <= 0:
                    urlParameters[param] = None
            except ValueError:
                urlParameters[param] = None

    if urlParameters['aiTime'] is not None:
        urlParameters['aiPositions'] = None
        urlParameters['startingTime'] = None
        urlParameters['increment'] = None
        urlParameters['aiTime'] = int(urlParameters['aiTime'])
    elif urlParameters['aiPositions'] is not None:
        urlParameters['startingTime'] = None
        urlParameters['increment'] = None
        urlParameters['aiPositions'] = int(urlParameters['aiPositions'])
    elif urlParameters['startingTime'] is not None:
        urlParameters['startingTime'] = int(urlParameters['startingTime'])
        if urlParameters['increment'] is None:
            urlParameters['increment'] = 10
        else:
            urlParameters['increment'] = int(urlParameters['increment'])
    elif urlParameters['increment'] is not None:
        urlParameters['startingTime'] = 900
        urlParameters['increment'] = int(urlParameters['increment'])
    else:
        urlParameters['aiTime'] = 10

    return urlParameters

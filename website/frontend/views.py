from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.apps import apps
GameStatistic = apps.get_model('backend', 'GameStatistic')
PageView = apps.get_model('backend', 'PageView')


# TODO: https://medium.com/front-end-weekly/how-to-optimize-image-loading-on-your-website-855020fb41ae


def index(request):
    PageView(page='index', url_params='').save()
    return render(request, 'frontend/index.html')


def aquadrone_mechanical(request):
    PageView(page='aquadrone-mechanical', url_params='').save()
    return render(request, 'frontend/aquadrone_mechanical.html')


def aquadrone_software(request):
    PageView(page='aquadrone-software', url_params='').save()
    return render(request, 'frontend/aquadrone_software.html')


def sunnybrook(request):
    PageView(page='sunnybrook', url_params='').save()
    return render(request, 'frontend/sunnybrook.html')


def tigercat(request):
    PageView(page='tigercat', url_params='').save()
    return render(request, 'frontend/tigercat.html')


def machine_learning(request):
    PageView(page='machine-learning', url_params='').save()
    return render(request, 'frontend/machine_learning.html')


def website(request):
    PageView(page='website', url_params='').save()
    return render(request, 'frontend/website.html')


def games(request):
    PageView(page='games', url_params='').save()
    return render(request, 'frontend/games.html', {'title': 'Game Select'})


@ensure_csrf_cookie
def play(request):
    PageView(page='play', url_params=request.META['QUERY_STRING']).save()

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
        'comments': [{'name': game_statistic.name, 'result': game_statistic.get_winner_str(),
                      'comment': game_statistic.comment, 'date': game_statistic.date_played.strftime('%B %d, %Y')}
                     for game_statistic in query if game_statistic.comment != '']
    }

    return render(request, 'frontend/play.html', {
        'title': get_human_readable_name(urlParameters['game']),
        'urlParametersJSON': urlParameters,
        'gameStatisticsJSON': game_statistics
    })


def clean_url_parameters(urlParameters):
    for param in ['aiTime', 'aiPositions', 'startingTime', 'increment']:
        if urlParameters[param] is not None:
            try:
                urlParameters[param] = int(urlParameters[param])
                # every param must be positive except for increment which must be non-negative
                if urlParameters[param] < (0 if param == 'increment' else 1):
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


def get_human_readable_name(game_name):
    if game_name == 'connect4':
        return 'Connect 4'
    elif game_name == 'checkers':
        return 'Checkers'
    elif game_name == 'othello':
        return 'Othello'
    elif game_name == 'amazons':
        return 'The Game of the Amazons'
    else:
        return 'Play Game'

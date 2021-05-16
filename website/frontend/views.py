from django.shortcuts import render, redirect
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

    url_parameters = clean_url_parameters({
        'game': request.GET.get('game', 'connect4'),
        'difficulty': request.GET.get('difficulty', 'medium'),
        'startingTime': request.GET.get('starting-time', None),
        'increment': request.GET.get('increment', None),
        'aiTime': request.GET.get('ai-time', None),
        'aiPositions': request.GET.get('ai-positions', None),
        # any weird values, or the absence of a value will result in False
        'logStats': request.GET.get('log-stats', False) == 'true'
    })

    query = GameStatistic.objects.filter(game=url_parameters['game'], difficulty=url_parameters['difficulty']) \
        .order_by('-date_played')
    game_statistics = {
        'humanWins': sum([game_statistic.winner == 1 for game_statistic in query]),
        'aiWins': sum([game_statistic.winner == -1 for game_statistic in query]),
        'draws': sum([game_statistic.winner == 0 for game_statistic in query]),
        'comments': [{'name': game_statistic.name, 'result': game_statistic.get_winner_str(),
                      'comment': game_statistic.comment, 'date': game_statistic.date_played.strftime('%B %d, %Y')}
                     for game_statistic in query if game_statistic.comment != '']
    }

    return render(request, 'frontend/play.html', {
        'title': get_human_readable_name(url_parameters['game']),
        'urlParametersJSON': url_parameters,
        'gameStatisticsJSON': game_statistics
    })


def connect4(_):
    return redirect('/play?game=checkers&difficulty=hard&ai-time=3&log-stats=true', permanent=True)


def clean_url_parameters(url_parameters):
    for param in ['aiTime', 'aiPositions', 'startingTime', 'increment']:
        if url_parameters[param] is not None:
            try:
                url_parameters[param] = int(url_parameters[param])
                # every param must be positive except for increment which must be non-negative
                if url_parameters[param] < (0 if param == 'increment' else 1):
                    url_parameters[param] = None
            except ValueError:
                url_parameters[param] = None

    if url_parameters['aiTime'] is not None:
        url_parameters['aiPositions'] = None
        url_parameters['startingTime'] = None
        url_parameters['increment'] = None
        url_parameters['aiTime'] = int(url_parameters['aiTime'])
    elif url_parameters['aiPositions'] is not None:
        url_parameters['startingTime'] = None
        url_parameters['increment'] = None
        url_parameters['aiPositions'] = int(url_parameters['aiPositions'])
    elif url_parameters['startingTime'] is not None:
        url_parameters['startingTime'] = int(url_parameters['startingTime'])
        if url_parameters['increment'] is None:
            url_parameters['increment'] = 10
        else:
            url_parameters['increment'] = int(url_parameters['increment'])
    elif url_parameters['increment'] is not None:
        url_parameters['startingTime'] = 900
        url_parameters['increment'] = int(url_parameters['increment'])
    else:
        url_parameters['aiTime'] = 10

    return url_parameters


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

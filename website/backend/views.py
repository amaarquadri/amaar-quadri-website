from django.http import HttpResponse
import json
from django.apps import apps
GameStatistic = apps.get_model('backend', 'GameStatistic')


def post_statistic(request):
    payload = json.loads(request.body)

    try:
        game = payload['game']
        difficulty = payload['difficulty']
        winner = payload['winner']
        uuid = payload['uuid']
    except KeyError:
        return HttpResponse(status=400)  # Bad Request

    statistic = GameStatistic(game=game, difficulty=difficulty, winner=winner, comment='', uuid=uuid)
    statistic.save()
    return HttpResponse(status=201)  # Created


def post_comment(request):
    payload = json.loads(request.body)

    try:
        comment = payload['comment']
        uuid = payload['uuid']
    except KeyError:
        return HttpResponse(status=400)  # Bad Request

    try:
        statistic = GameStatistic.objects.get(uuid=uuid)
    except GameStatistic.DoesNotExist:
        return HttpResponse(status=404)  # Not Found
    except GameStatistic.MultipleObjectsReturned:
        return HttpResponse(status=500)  # Internal Server Error

    statistic.comment = comment
    statistic.save()
    return HttpResponse(status=201)  # Created

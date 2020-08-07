from django.db import models


class GameStatistic(models.Model):
    game = models.CharField(max_length=50)
    date_played = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(max_length=20)
    winner = models.IntegerField()
    comment = models.TextField()
    uuid = models.CharField(max_length=36)  # 36 is the standard uuid length

    def __str__(self):
        return f'{self.game}, {self.date_played}'

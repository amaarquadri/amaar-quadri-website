from django.db import models


class GameStatistic(models.Model):
    game = models.CharField(max_length=50)
    date_played = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(max_length=20)
    winner = models.IntegerField()
    name = models.TextField()
    comment = models.TextField()
    uuid = models.CharField(max_length=36)  # 36 is the standard uuid length

    def __str__(self):
        formatted_date = self.date_played.strftime('%H:%M:%S - %B %d, %Y')
        return f'{self.game}, {formatted_date}'

    def get_winner_str(self):
        return 'D' if self.winner == 0 else ('W' if self.winner == 1 else 'L')


class PageView(models.Model):
    page = models.CharField(max_length=50)
    url_params = models.TextField()
    date_played = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        formatted_date = self.date_played.strftime('%H:%M:%S - %B %d, %Y')
        return f'{self.page}, {formatted_date}'

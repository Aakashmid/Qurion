from django.db import models

# Create your models here.
class Message(models.Model):
    request_text = models.TextField()
    response_text = models.TextField()
    # reactions 

    def __str__(self):
        return self.request_text
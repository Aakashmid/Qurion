from django.db import models
import secrets


class Conversation(models.Model):
    name = models.CharField(max_length=255)
    token = models.CharField(max_length=100, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)  # generating a unique random token
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name # this will be the name of the conversation in the admin panel


# Create your models here.
class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages',  on_delete=models.CASCADE)
    request_text = models.TextField()
    response_text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    # reactions 

    def __str__(self):
        return self.conversation.name  + " - "+  self.request_text
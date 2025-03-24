from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.email if self.email else self.username

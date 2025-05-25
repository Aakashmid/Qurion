from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    date_updated = models.DateTimeField(auto_now=True)


    # add more fields in future like avatar or bio


    def __str__(self):
        return self.email if self.email else self.username

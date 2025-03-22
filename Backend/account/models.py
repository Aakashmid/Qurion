from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, blank=True, null=True)
    username = models.CharField(unique=True, blank=True, null=True, max_length=150)

    USERNAME_FIELD = 'email'  # Default authentication field
    REQUIRED_FIELDS = []  # No required fields since either username or email can be used

    def __str__(self):
        return self.email if self.email else self.username

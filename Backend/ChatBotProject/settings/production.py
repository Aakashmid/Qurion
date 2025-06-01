from .base import *
from  decouple import config

DEBUG = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')


DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'URL': config('DATABASE_URL'),
      }      
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    config('CORS_ALLOWED_ORIGINS').split(',')
]



CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [config("CHANNEL_LAYERS_REDIS_URL")],
        },  
    },
}


# Ensure secure cookies in production
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'
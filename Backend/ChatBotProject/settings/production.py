from .base import *
from  decouple import config

DEBUG = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    config('CORS_ALLOWED_ORIGINS').split(',')
]

# Ensure secure cookies in production
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'
from .base import *

DEBUG = False
ALLOWED_HOSTS = ['your-production-domain.com']

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend-domain.com',  # Frontend origin
]

# Ensure secure cookies in production
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'
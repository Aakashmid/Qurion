from .base import *  # Import base settings

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # Frontend origin
]

SIMPLE_JWT['AUTH_COOKIE_SECURE'] = False  # Disable secure cookies for local development
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'  # Allow cross-site cookies for local development
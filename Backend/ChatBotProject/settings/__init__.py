from decouple import config

ENVIRONMENT = config('DJANGO_ENV', default='development')
# Debug statement to confirm which settings file is being loaded
print(f"Loading settings for environment: {ENVIRONMENT}")

if ENVIRONMENT == 'production':
    from .production import *
else:
    from .development import *
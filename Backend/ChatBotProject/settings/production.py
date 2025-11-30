from .base import *
from decouple import config
import dj_database_url

DEBUG = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS').split(',')


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS').split(',')


STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DATABASES = {
    'default': dj_database_url.config(
        # Replace this value with your local database's connection string.
        default=config('DATABASE_URL'),
        conn_max_age=600,
    )
}

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




LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,

    # --- FORMATTERS ---
    "formatters": {
        "verbose": {
            "format": "[{levelname}] {asctime} {name} | {message}",
            "style": "{",
        },
        "simple": {
            "format": "[{levelname}] {message}",
            "style": "{",
        },
    },

    # --- HANDLERS ---
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
            "level": "INFO",
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "logs/django.log",
            "formatter": "verbose",
            "level": "WARNING",
        },
    },

    # --- LOGGERS ---
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console", "file"],
            "level": "ERROR",
            "propagate": False,
        },
        "your_app_name": {  # Replace with your project/app
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
    },

    # Root logger (fallback)
    "root": {
        "handlers": ["console", "file"],
        "level": "WARNING",
    },
}

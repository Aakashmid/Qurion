from .base import *  # Import base settings
import dj_database_url
DEBUG = True



DATABASES = {
    'default': dj_database_url.config(
        # Replace this value with your local database's connection string.
        default=config('DATABASE_URL'),
        conn_max_age=600,
    )
}

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },  
    },
}



SIMPLE_JWT['AUTH_COOKIE_SECURE'] = False  # Disable secure cookies for local development
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'None'  # Allow cross-site cookies for local development
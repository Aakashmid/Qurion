import dj_database_url

from .base import *  # Import base settings

DEBUG = True


DATABASES = {
    "default": dj_database_url.config(
        # Replace this value with your local database's connection string.
        default=DATABASE_URL,
        conn_max_age=600,
    )
}


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}


SIMPLE_JWT["AUTH_COOKIE_SECURE"] = False  # Disable secure cookies for local development
SIMPLE_JWT["AUTH_COOKIE_SAMESITE"] = (
    "None"  # Allow cross-site cookies for local development
)

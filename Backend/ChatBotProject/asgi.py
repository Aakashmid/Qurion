import os
import django
from django.core.asgi import get_asgi_application

# Set Django settings module BEFORE any Django imports
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatBotProject.settings')


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from ChatBotApp.routing import websocket_urlpatterns

# Get Django ASGI application early to ensure proper initialization
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
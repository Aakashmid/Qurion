import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatBotProject.settings')

# Initialize Django BEFORE importing Django components
django.setup()


from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from ChatBotApp.routing import websocket_urlpatterns


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(), 
        "websocket": URLRouter(websocket_urlpatterns)
    })

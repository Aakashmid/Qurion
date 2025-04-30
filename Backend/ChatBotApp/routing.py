from .consumers import ChatConsumer
from django.urls import path

websocket_urlpatterns = [
    path('ws/conversation/send-message/<str:conversation_token>/', ChatConsumer.as_asgi()),
]
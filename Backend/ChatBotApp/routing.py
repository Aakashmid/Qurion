from .consumers import ChatConsumer
from django.urls import path

websoket_urlpatterns = [
    path('ws/conversations/<str:conversation_token>/', ChatConsumer.as_asgi()),
]
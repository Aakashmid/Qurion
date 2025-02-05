from .consumers import ChatConsumer
from django.urls import path

websoket_urlpatterns = [
    path('ws/chat/send/<str:request_text>', ChatConsumer.as_asgi()),
]
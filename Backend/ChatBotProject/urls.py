from django.contrib import admin
from django.urls import path
from ChatBotApp.views import get_messages

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/messages/', get_messages, name='get_messages'),
]

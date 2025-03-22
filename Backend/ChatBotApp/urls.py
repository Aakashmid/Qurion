from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from ChatBotApp.views import  ConversationViewSet , get_conversation_messages
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'conversations',ConversationViewSet , basename='conversations')

urlpatterns = [
   
    path('conversations/<str:token>/messages/',get_conversation_messages , name='get-conversation-messages'),
    path('', include(router.urls)),

]
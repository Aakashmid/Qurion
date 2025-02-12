from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from ChatBotApp.views import  ConversationViewSet , server_status , get_conversation_messages
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = DefaultRouter()
router.register(r'conversations',ConversationViewSet , basename='conversations')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/server-status/', server_status, name='server-status'),
    path('api/conversations/<str:token>/messages/', get_conversation_messages, name='get-conversation-messages'),
    path('api/', include(router.urls)),
    # path('api/conversation/<str:token>', get_conversation, name='get-conversation'),
]

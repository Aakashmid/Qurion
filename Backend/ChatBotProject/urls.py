from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from ChatBotApp.views import get_conversation , ConversationViewSet

router = DefaultRouter()
router.register(r'conversations',ConversationViewSet , basename='conversation')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # path('api/conversation/<str:token>', get_conversation, name='get-conversation'),
]

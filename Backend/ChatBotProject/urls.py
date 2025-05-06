from django.contrib import admin
from django.urls import path, include
from ChatBotApp.views import ConversationViewSet, server_status
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Health Check
    path('api/server-status/', server_status, name='server-status'),

    
    # Authentication
    # Application Routes
    path('api/', include('ChatBotApp.urls')),
    path('', include('accounts.urls')),
]

from django.contrib import admin
from django.urls import path, include
from ChatBotApp.views import  server_status
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    # Admin
    path('admin-site/', admin.site.urls),

    # API Documentation
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Health Check
    path('api/server-status/', server_status, name='server-status'),

    
    # Application Routes
    path('api/', include('ChatBotApp.urls')),
    
    # Authentication
    path('', include('accounts.urls')),
]

from django.contrib import admin
from django.urls import path,include
from ChatBotApp.views import  ConversationViewSet , server_status
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/server-status/', server_status, name='server-status'),

    path('api/', include('account.urls')), # user accouunt related urls
    path('api/', include('ChatBotApp.urls')),  # chat related urls

]

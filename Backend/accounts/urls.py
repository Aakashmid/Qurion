from django.urls import path, include
from .views import RegisterView, UserViewSet, LoginView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from allauth.socialaccount.providers.google import views as google_views
from allauth.socialaccount import urls as socialaccount_urls

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    # path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', RegisterView.as_view(), name='rest_register'),
    path('api/auth/login/', LoginView.as_view(), name='rest_login'),

    #social auth urls , not complete yet 
    path('api/auth/social/', include(socialaccount_urls)),
    path('api/auth/google/login/',google_views.oauth2_login,name='google_login'),
    path('api/auth/google/callback/',google_views.oauth2_callback,name='google_callback'),
    path('api/', include(router.urls)),
]
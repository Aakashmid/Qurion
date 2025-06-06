from django.urls import path, include
from .views import RegisterView, UserViewSet, LoginView , CustomTokenRefreshView , LogoutView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter



urlpatterns = [
    # path('api/auth/', include('dj_rest_auth.urls')),

    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    
    path('api/auth/refresh/',CustomTokenRefreshView.as_view(), name='token_refresh'),  
    path('api/user/',UserViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'delete': 'destroy'}), name='user-detail'),
]
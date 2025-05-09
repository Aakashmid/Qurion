from rest_framework import viewsets, generics, status
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


User = get_user_model()


class TokenService:
    @staticmethod
    def set_cookie_helper(response, key, value, max_age=None):
        response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            secure=True,
            samesite="None",
            path='/api/auth/',
            max_age=max_age,
        )

    @staticmethod
    def create_token_response(user, message, status_code):
        refresh = RefreshToken.for_user(user)
        response = Response(
            {
                'message': message,
                'access': str(refresh.access_token),
            },
            status=status_code,
        )
        TokenService.set_cookie_helper(
            response,
            key='refresh_token',
            value=str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return response


class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token not found in cookies'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            return Response(
                {
                    'access': str(refresh.access_token),
                    'message': 'Access token refreshed successfully',
                },
                status=status.HTTP_200_OK,
            )
        except ValidationError:
            return Response(
                {'error': 'Invalid or expired refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return TokenService.create_token_response(
                user,
                'User registered successfully',
                status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return TokenService.create_token_response(
                user,
                'Login successful',
                status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            response = Response(
                {'message': 'Logout successful'},
                status=status.HTTP_200_OK
            )
            response.delete_cookie('refresh_token')
            return response
        except Exception:
            return Response(
                {'message': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if user != request.user:
            raise PermissionDenied("You do not have permission to update another user's details.")
        return super().update(request, *args, **kwargs)
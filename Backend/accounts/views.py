from rest_framework import viewsets, generics, status
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError


User = get_user_model()


def set_cookie_helper(response, key, value, max_age=None):
    response.set_cookie(
        key=key,
        value=value,
        httponly=True,  # Prevent JavaScript access
        secure=True,  # Set to True in production (requires HTTPS)
        samesite="None",  # for cross-site cookies
        path='/api/auth/refresh/',  # Restrict to refresh endpoint
        max_age=max_age,  # Set max age for the cookie
    )


class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get the refresh token from the cookies
        print("cookies received : ", request.COOKIES)
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate the refresh token and generate a new access token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response(
                {
                    'access': access_token,
                    'message': 'Access token refreshed successfully',
                },
                status=status.HTTP_200_OK,
            )

        except ValidationError:
            return Response({'error': 'Invalid or expired refresh token'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            # user_data = UserSerializer(user).data
            response = Response(
                {
                    'message': 'User registered successfully',
                    'access': str(refresh.access_token),
                    # 'user': user_data
                },
                status=status.HTTP_201_CREATED,
            )

            set_cookie_helper(
                response,
                key='refresh_token',
                value=str(refresh),
                max_age=60 * 60 * 24 * 7,  # 7 days
            )       
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            # user_data = UserSerializer(user).data

            response = Response(
                {
                    'message': 'Login successful',
                    'access': str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )

            # Set the refresh token in the cookie
            set_cookie_helper(
                response,
                key='refresh_token',
                value=str(refresh),
                max_age=60 * 60 * 24 * 7,  # 7 days
            )

            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        # Get the user being updated
        user = self.get_object()

        # Check if the authenticated user is the same as the user being updated
        if user != request.user:
            raise PermissionDenied("You do not have permission to update another user's details.")

        return super().update(request, *args, **kwargs)

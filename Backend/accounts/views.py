from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework import generics, status, viewsets
from rest_framework.exceptions import (
    APIException,
    AuthenticationFailed,
    MethodNotAllowed,
    NotAuthenticated,
    PermissionDenied,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


class TokenService:
    """Token service to create refresh and access tokens and set  refresh token to cookies"""

    @staticmethod
    def set_cookie_helper(response, key, value, max_age=None):
        response.set_cookie(
            key=key,
            value=value,
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
            max_age=max_age,
        )

    @staticmethod
    def create_token_response(user, message, status_code):
        refresh = RefreshToken.for_user(user)
        response = Response(
            {
                "message": message,
                "access": str(refresh.access_token),
            },
            status=status_code,
        )
        TokenService.set_cookie_helper(
            response,
            key="refresh_token",
            value=str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return response


class CustomTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                raise NotAuthenticated("Refresh token not found")

            # This will raise TokenError if blacklisted
            refresh = RefreshToken(refresh_token)

            # Generate new access token
            new_access_token = str(refresh.access_token)

            return Response(
                {"access": new_access_token, "message": "Token refreshed successfully"},
                status=status.HTTP_200_OK,
            )

        except TokenError as e:
            # Handle blacklisted or invalid tokens
            raise AuthenticationFailed("Token is blacklisted or invalid")
        except InvalidToken as e:
            raise AuthenticationFailed("Invalid token format")


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            raise ValidationError(serializer.errors)

        user = serializer.save()
        return TokenService.create_token_response(
            user, "User registered successfully", status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(
            raise_exception=True
        ):  # other way to handle error during validation (one is in register view)
            user = serializer.validated_data.get("user")
            return TokenService.create_token_response(
                user, "Login successful", status.HTTP_200_OK
            )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                raise NotAuthenticated("Refresh token not found")

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(
                {"message": "Logout successful"}, status=status.HTTP_200_OK
            )
            response.delete_cookie("refresh_token")
            return response
        except Exception:
            raise AuthenticationFailed("Invalid token ")


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        # Disable the list method
        raise MethodNotAllowed("GET", detail="Listing users is not allowed.")

    def retrieve(self, request, *args, **kwargs):
        # Retrieve the current user's details
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    #  delete user , before that also black list his token
    def destroy(self, request, *args, **kwargs):
        # Blacklist the refresh token
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            raise NotAuthenticated("Refresh token not found")

        # print(refresh_token)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception as e:
            return Response(
                {"detail": "Failed to blacklist token: {}".format(str(e))},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = super().destroy(
            request, *args, **kwargs
        )  # Call the parent destroy method
        response.delete_cookie("refresh_token")  # Remove the refresh token cookie
        return response

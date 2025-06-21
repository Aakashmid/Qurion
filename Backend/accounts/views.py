from rest_framework import viewsets, generics, status
from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied , MethodNotAllowed 
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
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
            path='/',
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
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token not found'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # This will raise TokenError if blacklisted
            refresh = RefreshToken(refresh_token)
            
            # Generate new access token
            new_access_token = str(refresh.access_token)
            
            return Response({
                'access': new_access_token,
                'message': 'Token refreshed successfully'
            }, status=status.HTTP_200_OK)
            
        except TokenError as e:
            # Handle blacklisted or invalid tokens
            return Response(
                {'error': 'Token is invalid or blacklisted', 'detail': str(e)}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        except InvalidToken as e:
            return Response(
                {'error': 'Invalid token format', 'detail': str(e)}, 
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
        error_message = next(iter(serializer.errors.values()))[0]
        return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)


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
        error_message = next(iter(serializer.errors.values()))[0]
        return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)



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
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            print(refresh_token)
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()

            except Exception as e:
                return Response(
                    {'error': 'Failed to blacklist token: {}'.format(str(e))},
                    status=status.HTTP_400_BAD_REQUEST
                )


            response = super().destroy(request, *args, **kwargs)  # Call the parent destroy method
            response.delete_cookie('refresh_token')  # Remove the refresh token cookie
            return response
    
        else:
            return Response(
                {'error': 'Refresh token not found in cookies'},
                status=status.HTTP_400_BAD_REQUEST
            )
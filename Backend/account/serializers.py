from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    # password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        # fields = ('username', 'email', 'password', 'password2')
        fields = ('username', 'email', 'password')

    def validate(self, attrs):
        if not attrs.get('username') and not attrs.get('email'):
            raise serializers.ValidationError("Either username or email is required.")
        
        # if attrs.get('password') != attrs.get('password2'):
        #     raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return attrs

    def create(self, validated_data):
        # validated_data.pop('password2')
        return User.objects.create_user(**validated_data)




from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        user = User.objects.filter(email=username_or_email).first() or User.objects.filter(username=username_or_email).first()

        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        
        attrs["username"] = user.email  # SimpleJWT expects "username"
        return super().validate(attrs)


# class UserSerializer(serializers.ModelSerializer):
#     name = serializers.SerializerMethodField()

#     class Meta:
#         model = User
#         fields = ('id', 'name', 'username', 'email', 'token', 'joined_at', 'updated_at')

#     def get_name(self, obj):
#         return f"{obj.first_name} {obj.last_name}".strip() or None

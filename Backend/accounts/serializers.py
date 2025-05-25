from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):

    username_or_email = serializers.CharField()

    class Meta:
        model = User
        fields = ['username_or_email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        
        # Check if the input is an email or username
        if '@' in username_or_email:
            if User.objects.filter(email=username_or_email).exists():
                raise ValidationError("Email is already in use.")
            attrs['email'] = username_or_email
            base_username = username_or_email.split('@')[0]
            counter = 1
            username = base_username

            # Ensure the username is unique by iterating til same username is not found
            while User.objects.filter(username=username).first():
                username = f"{base_username}{counter}"
                counter += 1
            attrs['username'] = username        

        else:
            if User.objects.filter(username=username_or_email).exists():
                raise ValidationError("Username is already in use.")
            attrs['username'] = username_or_email
        
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # Use an empty string as default email
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    def validate(self, attrs):
        username_or_email = attrs.get('username_or_email')
        password = attrs.get('password')

        # Check if the input is an email or username
        if '@' in username_or_email:
            user = User.objects.filter(email=username_or_email).first()
        else:
            user = User.objects.filter(username=username_or_email).first()

        if user and user.check_password(password):
            attrs['user'] = user
            return attrs
        raise serializers.ValidationError("Invalid credentials")
    

    
class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)  # Define `name` as a regular field

    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'date_joined', 'date_updated' ,'avatar')

    def validate_name(self, value):
        # Ensure the name is not empty
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value

    def update(self, instance, validated_data):
        name = validated_data.pop('name', None)
        if name:
            name_parts = name.split()
            if len(name_parts) >= 2:
                instance.first_name = name_parts[0]
                instance.last_name = ' '.join(name_parts[1:])
            else:
                instance.first_name = name
                instance.last_name = ''

        # Update other fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

    def to_representation(self, instance):
        # Combine first_name and last_name into `name` for the response
        ret = super().to_representation(instance)
        ret['name'] = f"{instance.first_name} {instance.last_name}".strip()
        return ret
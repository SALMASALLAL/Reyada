from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Profile





class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=100)

    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        user = User.objects.create_user(**validated_data)
        # Create profile for the user
        Profile.objects.create(user=user)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer that uses email instead of username
    """
    # Override the default username field to use email
    username_field = User.USERNAME_FIELD
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField()
        self.fields['password'] = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # Use authenticate with email field
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            'password': attrs['password'],
        }
        
        try:
            authenticate_kwargs['request'] = self.context['request']
        except KeyError:
            pass
        
        self.user = authenticate(**authenticate_kwargs)
        
        if self.user is None or not self.user.is_active:
            raise serializers.ValidationError(
                'No active account found with the given credentials'
            )
            
        return super().validate(attrs)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        # Note: User model doesn't have role field, so commenting this out
        # token['role'] = user.role
        
        return token


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = Profile
        fields = ('user_email', 'user_first_name', 'user_last_name', 'user_date_joined',
                 'profile_image', 'birth_date', 'bio', 'phone', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for user details with profile information
    """
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login', 'profile')
        read_only_fields = ('id', 'date_joined', 'last_login')


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "New password fields didn't match."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    first_name = serializers.CharField(source='user.first_name', max_length=100)
    last_name = serializers.CharField(source='user.last_name', max_length=100)

    class Meta:
        model = Profile
        fields = ('first_name', 'last_name', 'profile_image', 'birth_date', 'bio', 'phone')

    def update(self, instance, validated_data):
        # Update user fields
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

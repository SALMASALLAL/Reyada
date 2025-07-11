from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .serializers import (
    UserRegistrationSerializer,
    UserDetailSerializer,
    ChangePasswordSerializer,
    ProfileUpdateSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer
)
from .models import User, Profile

# Get the custom user model
User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing users - handles registration, login, profile management
    """
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'login']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        """
        Return the class to use for the serializer based on the action.
        """
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action == 'login':
            return CustomTokenObtainPairSerializer
        elif self.action == 'change_password':
            return ChangePasswordSerializer
        elif self.action == 'update_profile':
            return ProfileUpdateSerializer
        return UserDetailSerializer
    
    @swagger_auto_schema(
        operation_summary="Register a new user",
        operation_description="Create a new user account with email and password",
        request_body=UserRegistrationSerializer,
        responses={
            201: openapi.Response(
                description="User created successfully",
                examples={
                    "application/json": {
                        "message": "User created successfully",
                        "user": {
                            "id": 1,
                            "email": "user@example.com",
                            "first_name": "John",
                            "last_name": "Doe"
                        },
                        "tokens": {
                            "refresh": "refresh_token_here",
                            "access": "access_token_here"
                        }
                    }
                }
            ),
            400: "Bad Request - Validation errors"
        }
    )
    def create(self, request, *args, **kwargs):
        """
        Handle user registration
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User created successfully',
            'user': UserDetailSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        operation_summary="User login",
        operation_description="Authenticate user with email and password",
        request_body=CustomTokenObtainPairSerializer,
        responses={
            200: openapi.Response(
                description="Login successful",
                examples={
                    "application/json": {
                        "message": "Login successful",
                        "access": "access_token_here",
                        "refresh": "refresh_token_here"
                    }
                }
            ),
            400: "Bad Request - Invalid credentials"
        }
    )
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        User login endpoint
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # The custom serializer already includes tokens and user data
        return Response({
            'message': 'Login successful',
            **serializer.validated_data
        }, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary="User logout",
        operation_description="Logout user by blacklisting the refresh token",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
            },
            required=['refresh']
        ),
        responses={
            200: openapi.Response(
                description="Logout successful",
                examples={
                    "application/json": {
                        "message": "Logout successful"
                    }
                }
            ),
            400: "Bad Request - Invalid token"
        }
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout endpoint - blacklist the refresh token
        """
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_summary="Get user profile",
        operation_description="Get current authenticated user's profile information",
        responses={
            200: openapi.Response(
                description="User profile retrieved successfully",
                schema=UserDetailSerializer
            ),
            401: "Unauthorized - Authentication required"
        }
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """
        Get current user profile
        """
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        methods=['put', 'patch'],
        operation_summary="Update user profile",
        operation_description="Update current user's profile information",
        request_body=ProfileUpdateSerializer,
        responses={
            200: openapi.Response(
                description="Profile updated successfully",
                examples={
                    "application/json": {
                        "message": "Profile updated successfully",
                        "user": {
                            "id": 1,
                            "email": "user@example.com",
                            "first_name": "John",
                            "last_name": "Doe"
                        }
                    }
                }
            ),
            400: "Bad Request - Validation errors",
            401: "Unauthorized - Authentication required"
        }
    )
    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update user profile
        """
        profile = request.user.profile
        serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'user': UserDetailSerializer(request.user).data
        }, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary="Change password",
        operation_description="Change current user's password",
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response(
                description="Password changed successfully",
                examples={
                    "application/json": {
                        "message": "Password changed successfully"
                    }
                }
            ),
            400: "Bad Request - Validation errors or incorrect old password",
            401: "Unauthorized - Authentication required"
        }
    )
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """
        Change password endpoint
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class ProfileViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing user profiles
    """
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return the profile for the currently authenticated user.
        """
        return Profile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Save the profile instance with the current user.
        """
        serializer.save(user=self.request.user)


# Keeping the function-based view for backward compatibility
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Get current user profile (function-based view for backward compatibility)
    """
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

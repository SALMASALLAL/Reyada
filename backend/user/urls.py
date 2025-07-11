from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Create a router and register our ViewSets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profiles', views.ProfileViewSet, basename='profile')

urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
    
    # Token refresh (keeping this separate as it's a JWT view)
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Backward compatibility endpoint
    path('profile/detail/', views.user_profile_view, name='user-profile-detail'),
]

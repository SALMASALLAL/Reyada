from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BitrixContactViewSet

router = DefaultRouter()
router.register(r'bitrix-contacts', BitrixContactViewSet, basename='bitrix-contacts')

urlpatterns = [
    path('', include(router.urls)),
]

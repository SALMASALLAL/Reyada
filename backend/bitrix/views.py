from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import BitrixContact
from .serializers import BitrixContactSerializer
import logging

logger = logging.getLogger(__name__)


class BitrixContactListView(generics.ListAPIView):
    """
    API endpoint to list all Bitrix contacts
    """
    queryset = BitrixContact.objects.all()
    serializer_class = BitrixContactSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List all Bitrix contacts",
        operation_description="Retrieve a list of all Bitrix24 CRM contacts stored in the database",
        responses={
            200: openapi.Response(
                description="List of Bitrix contacts retrieved successfully",
                schema=BitrixContactSerializer(many=True)
            ),
            401: "Unauthorized - Authentication required"
        }
    )
    def get(self, request, *args, **kwargs):
        logger.info(f"BitrixContactListView accessed by user: {request.user}")
        logger.info(f"Is authenticated: {request.user.is_authenticated}")
        logger.info(f"Authorization header: {request.META.get('HTTP_AUTHORIZATION', 'Not provided')}")
        return super().get(request, *args, **kwargs)

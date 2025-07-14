import requests
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.conf import settings
from .models import BitrixContact
from .serializers import BitrixContactSerializer
import logging

logger = logging.getLogger(__name__)


class BitrixContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Bitrix contacts with CRUD operations and Bitrix24 sync
    """
    queryset = BitrixContact.objects.all()
    serializer_class = BitrixContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Override permissions to allow only read and create operations
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            # Disable update and delete operations
            permission_classes = []
        return [permission() for permission in permission_classes]
    
    # Bitrix24 API configuration
    @property
    def bitrix_base_url(self):
        return getattr(settings, 'BITRIX24_BASE_URL', 'https://b24-0r8mng.bitrix24.com/rest/1/iolappou7w3kdu2w')

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
    def list(self, request, *args, **kwargs):
        logger.info(f"BitrixContact list accessed by user: {request.user}")
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create new contact",
        operation_description="Create a new contact in database and sync with Bitrix24 CRM",
        request_body=BitrixContactSerializer,
        responses={
            201: openapi.Response(
                description="Contact created successfully and synced with Bitrix24",
                schema=BitrixContactSerializer
            ),
            400: "Bad Request - Invalid data",
            401: "Unauthorized - Authentication required",
            500: "Internal Server Error - Bitrix sync failed"
        }
    )
    def create(self, request, *args, **kwargs):
        logger.info(f"Creating new contact by user: {request.user}")
        
        # Check for duplicate email
        email = request.data.get('email', '').strip().lower()
        if BitrixContact.objects.filter(email__iexact=email).exists():
            return Response(
                {'email': ['A contact with this email already exists.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate and save to database first
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save to database
        contact = serializer.save()
        logger.info(f"Contact saved to database: {contact}")
        
        # Sync with Bitrix24
        try:
            self._sync_contact_to_bitrix(contact)
            logger.info(f"Contact successfully synced to Bitrix24: {contact}")
        except Exception as e:
            logger.error(f"Failed to sync contact to Bitrix24: {e}")
            # Don't delete the contact from database, just log the error
            # In production, you might want to implement a retry mechanism
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """
        Disable update operations - contacts should be managed through Bitrix24
        """
        return Response(
            {'detail': 'Update operations are not allowed. Please modify contacts in Bitrix24.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def partial_update(self, request, *args, **kwargs):
        """
        Disable partial update operations - contacts should be managed through Bitrix24
        """
        return Response(
            {'detail': 'Update operations are not allowed. Please modify contacts in Bitrix24.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def destroy(self, request, *args, **kwargs):
        """
        Disable delete operations - contacts should be managed through Bitrix24
        """
        return Response(
            {'detail': 'Delete operations are not allowed. Please delete contacts in Bitrix24.'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def _sync_contact_to_bitrix(self, contact):
        """
        Sync contact to Bitrix24 CRM using crm.contact.add API
        """
        api_url = f"{self.bitrix_base_url}/crm.contact.add.json"
        
        # Prepare data in Bitrix24 format
        fields = {
            "NAME": contact.name or "",
            "LAST_NAME": contact.last_name or "",
            "EMAIL": [{"VALUE": contact.email, "VALUE_TYPE": "WORK"}]
        }
        
        # Add phone if available
        if contact.phone:
            fields["PHONE"] = [{"VALUE": contact.phone, "VALUE_TYPE": "WORK"}]
        
        payload = {"fields": fields}
        
        logger.info(f"Sending contact to Bitrix24: {payload}")
        
        response = requests.post(api_url, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        if 'error' in result:
            raise Exception(f"Bitrix24 API error: {result['error']}")
        
        logger.info(f"Bitrix24 response: {result}")
        return result

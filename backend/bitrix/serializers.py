from rest_framework import serializers
from .models import BitrixContact


class BitrixContactSerializer(serializers.ModelSerializer):
    """
    Serializer for BitrixContact model
    """
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = BitrixContact
        fields = ['id', 'name', 'last_name', 'email', 'phone', 'full_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_email(self, value):
        """
        Validate email uniqueness
        """
        if value:
            value = value.strip().lower()
            # Check for existing email (case-insensitive)
            if BitrixContact.objects.filter(email__iexact=value).exists():
                raise serializers.ValidationError("A contact with this email already exists.")
        return value

    def validate_name(self, value):
        """
        Validate name field
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()

    def validate_last_name(self, value):
        """
        Clean last name field
        """
        return value.strip() if value else value

    def validate_phone(self, value):
        """
        Clean phone field
        """
        return value.strip() if value else value

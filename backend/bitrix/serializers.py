from rest_framework import serializers
from .models import BitrixContact


class BitrixContactSerializer(serializers.ModelSerializer):
    """
    Serializer for BitrixContact model
    """
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = BitrixContact
        fields = ['id', 'name', 'last_name', 'email', 'full_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

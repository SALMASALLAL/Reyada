from django.contrib import admin
from .models import BitrixContact


@admin.register(BitrixContact)
class BitrixContactAdmin(admin.ModelAdmin):
    """
    Admin interface for BitrixContact model
    """
    list_display = ['full_name', 'email', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['name', 'last_name', 'email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['last_name', 'name']

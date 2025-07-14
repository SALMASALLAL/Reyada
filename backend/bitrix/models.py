from django.db import models


class BitrixContact(models.Model):
    """
    Model to store Bitrix24 CRM contacts
    """
    name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['last_name', 'name']
        verbose_name = 'Bitrix Contact'
        verbose_name_plural = 'Bitrix Contacts'

    def __str__(self):
        full_name = f"{self.name or ''} {self.last_name or ''}".strip()
        return f"{full_name} ({self.email})" if full_name else self.email

    @property
    def full_name(self):
        """Return the contact's full name"""
        return f"{self.name or ''} {self.last_name or ''}".strip()

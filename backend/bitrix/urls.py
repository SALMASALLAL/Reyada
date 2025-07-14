from django.urls import path
from .views import BitrixContactListView

urlpatterns = [
    path('bitrix-contacts/', BitrixContactListView.as_view(), name='bitrix-contacts-list'),
]

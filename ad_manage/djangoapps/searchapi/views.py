from django.shortcuts import render

# Create your views here.
from django.utils.translation import get_language
from oscarapi.views import basic

from rest_framework.mixins import ListModelMixin
from drf_haystack.generics import HaystackGenericAPIView

from .serializers import ProductSerializer, ProductSearcherSerializer


class ProductSearchView(ListModelMixin, HaystackGenericAPIView):

    serializer_class = ProductSearcherSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

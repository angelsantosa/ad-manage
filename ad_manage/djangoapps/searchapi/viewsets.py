# -*- coding: utf-8 -*-
from rest_framework import viewsets, filters, generics
from rest_framework.pagination import PageNumberPagination

from drf_haystack.viewsets import HaystackViewSet
from drf_haystack.filters import HaystackGEOSpatialFilter, HaystackAutocompleteFilter, HaystackFacetFilter

from .serializers import ProductSerializer, ProductSearcherSerializer, ProductFacetSerializer

from oscar.core.loading import get_class, get_model

class SearchViewSet(viewsets.ModelViewSet):
    """API endpoint that allows items to be viewed or edited."""
    Product = get_model('catalogue', 'Product')
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('publish_course_status',)

    # Se obtiene de forma automática la funcionalidad de:
    # .create()
    # .update()
    # .list()
    # .delete()
    # .retrive()

class BasicPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"

class SearchView(HaystackViewSet):

    # `index_models` is an optional list of which models you would like to include
    # in the search result. You might have several models indexed, and this provides
    # a way to filter out those of no interest for this particular view.
    # (Translates to `SearchQuerySet().models(*index_models)` behind the scenes.
    index_models = [get_model('catalogue', 'Product')]
    serializer_class = ProductSearcherSerializer
    pagination_class = BasicPagination
    filter_backends = [HaystackGEOSpatialFilter]

    # This will be used to filter and serialize faceted results
    facet_serializer_class = ProductFacetSerializer  # See example above!
    facet_filter_backends = [HaystackFacetFilter]   # This is the default facet filter, and
                                                    # can be left out.

import datetime

from django.utils.encoding import force_text
from rest_framework import serializers
from drf_haystack.serializers import HaystackSerializer, HaystackFacetSerializer, HaystackSerializerMixin

from search.search_indexes import ProductIndex

from oscar.core.loading import get_class, get_model

class ProductSerializer(serializers.ModelSerializer):
    """Product Serializer"""
    location_country = serializers.ReadOnlyField(source='location_country.code')

    class Meta:
        model = get_model('catalogue', 'Product')
        fields = '__all__'

    def get_country_name(self, obj):
        return force_text(obj.location_country.name)

class DistanceSerializer(serializers.Serializer):
    m = serializers.FloatField()
    km = serializers.FloatField()

class ProductSearcherSerializer(HaystackSerializerMixin, ProductSerializer):

    class Meta(ProductSerializer.Meta):
        # The `index_classes` attribute is a list of which search indexes
        # we want to include in the search.
        index_classes = [ProductIndex]

        # The `fields` contains all the fields we want to include.
        # NOTE: Make sure you don't confuse these with model attributes. These
        # fields belong to the search index!
        search_fields = (
            'category',
            'category_id',
            'course_description',
            'course_level',
            'course_name',
            'course_type',
            'course_language',
            'created',
            'date_end',
            'date_start',
            'discount_type',
            'id',
            'location_address',
            'location_city',
            'location_country',
            'location_internal_number',
            'location_latitude',
            'location_longitude',
            'location_mode',
            'location_outdoor_number',
            'location_postal_code',
            'location_state',
            'location_type',
            'maximum_apprentices',
            'minimum_apprentices',
            'payment_type',
            'price_currency',
            'price_program',
            'price_session',
            'publish_course_status',
            'updated',
            'text',
            'autocomplete'
        )
        ignore_fields = ["autocomplete"]

        # The `field_aliases` attribute can be used in order to alias a
        # query parameter to a field attribute. In this case a query like
        # /search/?q=oslo would alias the `q` parameter to the `autocomplete`
        # field on the index.
        field_aliases = {
            "q": "autocomplete"
        }

class ProductFacetSerializer(HaystackFacetSerializer):
    serialize_objects = False  # Setting this to True will serialize the
                               # queryset into an `objects` list. This
                               # is useful if you need to display the faceted
                               # results. Defaults to False.

    class Meta:
        # The `index_classes` attribute is a list of which search indexes
        # we want to include in the search.
        index_classes = [ProductIndex]

        # The `fields` contains all the fields we want to include.
        # NOTE: Make sure you don't confuse these with model attributes. These
        # fields belong to the search index!
        fields = ['course_type', 'created', 'price_program']
        field_options = {
            "course_type": {},
            "price_program": {},
            "created": {
                "start_date": datetime.datetime.now() - datetime.timedelta(days=3 * 365),
                "end_date": datetime.datetime.now(),
                "gap_by": "month",
                "gap_amount": 3
            }
        }

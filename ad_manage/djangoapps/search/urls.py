from django.conf.urls import patterns, url
from .views import SearchV2View

urlpatterns = [
    # url(r'^my brand new url$', login_required(superview.as_view()), name="da-super-name"),
    url(r'$', SearchV2View.as_view(), name="search-v2"),
]

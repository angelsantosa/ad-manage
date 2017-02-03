from django.conf.urls import patterns, url, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views
from .routers import router

urlpatterns = urlpatterns = [
    url(r'^', include(router.urls)),
]

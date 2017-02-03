# -*- coding: utf-8 -*-
from rest_framework import routers
from .viewsets import SearchView

# Routers proporcionan una forma sencilla y automática para determinar
# la configuración de URLs
router = routers.DefaultRouter()
router.register(r'_search/product', SearchView, base_name="product-search")

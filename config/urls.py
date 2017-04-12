# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.i18n import javascript_catalog

from oscar.app import application
from oscarapi.app import application as api

js_info_dict = {
    'packages': ('oscar.customer',),
}

urlpatterns = [
    url(r'^i18n/', include('django.conf.urls.i18n')),

    # The Django admin is not officially supported; expect breakage.
    # Nonetheless, it's often useful for debugging.
    url(r'^admin/', include(admin.site.urls)),

    url(r'', include("course.urls")),
    url(r'', include(application.urls)),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^api/', include(api.urls)),
    url(r'^api/', include('searchapi.urls')),
    # paypal URL
    url(r'^checkout/paypal/', include('paypal.express.urls')),
    # Optional
    # (r'^dashboard/paypal/express/', include(application.urls)),
    # (r'', include(shop.urls)),

    # To use Django user-to-user messages.

    url(r'customer/', include('customer.urls', namespace='customeri')),

    url(r'^messages/', include('django_messages.urls')),
    # document_manager
    url(r'^document_manager/', include('document_manager.urls')),
    url(r'^mentor/', include('partner.urls')),
    url(r'^thirdauth/', include('third_party_auth.urls')),
    url(r'^s/', include('search.urls')),
    url(r'^i18n.js', javascript_catalog, js_info_dict, name='javascript-catalog'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]

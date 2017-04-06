# -*- coding: utf-8 -*-
"""
Local settings

- Run in Debug mode
- Use console backend for emails
- Add Django Debug Toolbar
- Add django-extensions as app
"""

from .common import *  # noqa

# DEBUG
# ------------------------------------------------------------------------------
DEBUG = env.bool('DJANGO_DEBUG', default=True)
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG

# SECRET CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
# Note: This key only used for development and testing.
SECRET_KEY = env('DJANGO_SECRET_KEY', default='gwwx==uyr1+%^dp*m)b=5tma@h4v7!7a@7ty9trs#y4_*_!sxx')

# Mail settings
# ------------------------------------------------------------------------------

EMAIL_PORT = 1025

EMAIL_HOST = 'localhost'
EMAIL_BACKEND = env('DJANGO_EMAIL_BACKEND',
                    default='django.core.mail.backends.console.EmailBackend')


# CACHING
# ------------------------------------------------------------------------------
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': ''
    }
}

# django-debug-toolbar

INTERNAL_IPS = ('127.0.0.1', '10.0.2.2',)

#DEVELOPMENT_APPS = (
#    'debug_toolbar',
#)
# django-extensions
#INSTALLED_APPS += DEVELOPMENT_APPS

#DEBUG_TOOLBAR_PATCH_SETTINGS = False
# Your local stuff: Below this line define 3rd party library settings

#LOCAL_MIDDLEWARE_CLASSES = (
    # ...
#    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ...
#)

#MIDDLEWARE_CLASSES += LOCAL_MIDDLEWARE_CLASSES

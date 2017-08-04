# -*- coding: utf-8 -*-
"""
Django settings for ad-manage project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""
from __future__ import absolute_import, unicode_literals

from oscar.defaults import *
from oscar import OSCAR_MAIN_TEMPLATE_DIR, get_core_apps
import os
import sys
import environ
from path import Path as path

ROOT_DIR = environ.Path(__file__) - 3  # (ad_manage/config/settings/common.py - 3 = ad_manage/)
PROJECT_ROOT = path(__file__).abspath().dirname().dirname().dirname() # Root del proyecto en str

APPS_DIR = ROOT_DIR.path('ad_manage')
APPS_DIR_STR = PROJECT_ROOT / 'ad_manage' / 'djangoapps' #Directorio de aplicaciones django
sys.path.append(APPS_DIR_STR) #Definicion de carpeta para encontrar las apps

env = environ.Env()
environ.Env.read_env()
# APP CONFIGURATION
# ------------------------------------------------------------------------------
DJANGO_APPS = (
    # Default Django apps:
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.flatpages',
    'rest_framework',
    'paypal',
    'django_extensions',
    'django_messages',

    # Useful template tags:
    # 'django.contrib.humanize',

    # Admin
    'django.contrib.admin',
    'jsonify',
)
THIRD_PARTY_APPS = (
    'crispy_forms',  # Form layouts
    'compressor',
    'widget_tweaks',
    'social.apps.django_app.default',
    'django_countries', # paises para db
    'geopy',
    'corsheaders',
)
OSCAR_APPS = tuple(get_core_apps(['catalogue', 'search', 'partner','customer']))

# Apps specific for this project go here.
LOCAL_APPS = (
    # Your stuff: custom apps go here
    'searchapi',
    'course',
    'document_manager',
    'third_party_auth',
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS + OSCAR_APPS

# MIDDLEWARE CONFIGURATION
# ------------------------------------------------------------------------------
MIDDLEWARE_CLASSES = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'oscar.apps.basket.middleware.BasketMiddleware',
    'django.contrib.flatpages.middleware.FlatpageFallbackMiddleware',
    'social.apps.django_app.middleware.SocialAuthExceptionMiddleware',
)

# MIGRATIONS CONFIGURATION
# ------------------------------------------------------------------------------

# DEBUG
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = env.bool('DJANGO_DEBUG', False)

# FIXTURE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-FIXTURE_DIRS
FIXTURE_DIRS = (
    str(APPS_DIR.path('fixtures')),
)

# EMAIL CONFIGURATION
# ------------------------------------------------------------------------------
EMAIL_BACKEND = env('DJANGO_EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')

# MANAGER CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = (
    ("""dilosung""", 'santosa@dilosung.com'),
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS

# DATABASE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    # Raises ImproperlyConfigured exception if DATABASE_URL not in os.environ
    'default': env.db('DATABASE_URL', default='postgres:///admanage'),
}
DATABASES['default']['ATOMIC_REQUESTS'] = True


# GENERAL CONFIGURATION
# ------------------------------------------------------------------------------
# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
LANGUAGES = (
    ('en', ('English')),
    ('es', ('Spanish')),
)

TIME_ZONE = 'UTC'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = 'es-mx'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True

# TEMPLATE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        'DIRS': [
            str(APPS_DIR.path('templates')),
            OSCAR_MAIN_TEMPLATE_DIR
        ],
        'OPTIONS': {
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
            'debug': DEBUG,
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
            ],
            # See: https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
                # Your stuff: custom template context processors go here
                'oscar.apps.search.context_processors.search_form',
                'oscar.apps.promotions.context_processors.promotions',
                'oscar.apps.checkout.context_processors.checkout',
                'oscar.apps.customer.notifications.context_processors.notifications',
                'oscar.core.context_processors.metadata',
                # django-social-auth
                'social.apps.django_app.context_processors.backends',
                'social.apps.django_app.context_processors.login_redirect',
            ],
        },
    },
]

# See: http://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = 'bootstrap3'

# STATIC FILE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = str(ROOT_DIR('staticfiles'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = '/static/'

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = (
    str(APPS_DIR.path('static')),
)

# See: https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# MEDIA CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(APPS_DIR('media'))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = '/media/'

# URL Configuration
# ------------------------------------------------------------------------------
ROOT_URLCONF = 'config.urls'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = 'config.wsgi.application'

# AUTHENTICATION CONFIGURATION
# ------------------------------------------------------------------------------
AUTHENTICATION_BACKENDS = (
    'oscar.apps.customer.auth_backends.EmailBackend',
    'social.backends.google.GoogleOAuth2',
    'social.backends.twitter.TwitterOAuth',
    'social.backends.facebook.FacebookOAuth2',
    'social.backends.linkedin.LinkedinOAuth',
    'django.contrib.auth.backends.ModelBackend',
)

# SLUGLIFIER
AUTOSLUG_SLUGIFY_FUNCTION = 'slugify.slugify'


# Location of root django.contrib.admin URL, use {% url 'admin:index' %}
ADMIN_URL = r'^admin/'

# Your common stuff: Below this line define 3rd party library settings

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': env("ELASTICSEARCH_SERVER_URL", default='http://127.0.0.1:9200/'),
        'INDEX_NAME': 'ad_manage',
    },
}
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

# REST AUTH CONFIGURATION
# ------------------------------------------------------------------------------
REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'users.serializers.UserDetailsSerializer'
}

SOCIAL_AUTH_FACEBOOK_KEY = '473625016174858'
SOCIAL_AUTH_FACEBOOK_SECRET = 'cd56815ec4dbbd3f29b7c20938e2510a'

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '724697221459-8792b05mvdtju5makgtvh9a8ctplom9d.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'dPf6pnj0UIkgLwSJ24o5nErA'

SOCIAL_AUTH_LINKEDIN_KEY = '75lbs3827ex6w1'
SOCIAL_AUTH_LINKEDIN_SECRET = '9nCbCqnpGxszrNfw'

SOCIAL_AUTH_TWITTER_KEY = 'VClYhRXoMY7YhWHRyhKgfYh8D'
SOCIAL_AUTH_TWITTER_SECRET = 'kpFMyKQ3ufWHzJZ3Slp4Ru4OjCdPGACJI1Jz6w7pjkxv3ow0EL'

# PAY PAL CONFIGURATION
# ------------------------------------------------------------------------------
PAYPAL_API_USERNAME = 'omar.miranda_api1.me.com'
PAYPAL_API_PASSWORD = '8QEN2EC2ZC48F373'
PAYPAL_API_SIGNATURE = 'AFcWxV21C7fd0v3bYYYRCpSSRl31A-8GLBUs91.2XXT3PXmeNJQ0E1gr'
PAYPAL_SOLUTION_TYPE = 'Mark'
PAYPAL_SANDBOX_MODE = 'True'

# OSCAR CONFIGURATION
# ------------------------------------------------------------------------------
OSCAR_MISSING_IMAGE_URL = MEDIA_URL + 'image_not_found.jpg'
OSCAR_DEFAULT_CURRENCY = 'MXN'
OSCAR_SHOP_NAME = 'eCharli'
OSCAR_SHOP_TAGLINE = 'Teaching the world'

############################# MENTOR RECEIPT UPLOAD #############################

# MENTOR RECEIPT CONFIG
# WARNING: Certain django storage backends do not support atomic
# file overwrites (including the default, OverwriteStorage) - instead
# there are separate calls to delete and then write a new file in the
# storage backend.  This introduces the risk of a race condition
# occurring when a user uploads a new profile image to replace an
# earlier one (the file will temporarily be deleted).
MENTOR_RECEIPT_BACKEND = {
    'class': 'storages.backends.overwrite.OverwriteStorage',
    'options': {
        'location': os.path.join(MEDIA_ROOT, 'mentor-receipt/'),
        'base_url': os.path.join(MEDIA_URL, 'mentor-receipt/'),
    },
}
MENTOR_RECEIPT_DEFAULT_FILENAME = 'documents/mentor/default'
MENTOR_RECEIPT_DEFAULT_FILE_EXTENSION = 'pdf'
OSCAR_SEND_REGISTRATION_EMAIL = True
# This secret key is used in generating unguessable URLs to users'
# mentor documents.  Once it has been set, changing it will make the
# platform unaware of current document URLs, resulting in reverting all
# users' mentor documents to the default placeholder document.
MENTOR_RECEIPT_SECRET_KEY = 'placeholder secret key'
MENTOR_RECEIPT_MAX_BYTES = 1024 * 1024
MENTOR_RECEIPT_MIN_BYTES = 100

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.user.create_user',
    'third_party_auth.pipeline.save_profile',  # add data to CustomerProfile
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details',
)
LOGIN_REDIRECT_URL = '/'

#https://github.com/ottoyiu/django-cors-headers
CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_REGEX_WHITELIST = ('^(https?://)?(\w+\.)?dilosung\.com$', )

CORS_ALLOW_HEADERS = (
    'Access-Control-Allow-Origin',
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'x-csrftoken'
)

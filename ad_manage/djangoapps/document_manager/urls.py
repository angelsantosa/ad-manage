# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url

urlpatterns = patterns('document_manager.views',
    url(r'^list/$', 'list', name='list'),
)
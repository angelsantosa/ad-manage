from django.conf.urls import patterns, include, url

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('third_party_auth.views',
   url(r'^home/$', 'home', name='home'),   
)
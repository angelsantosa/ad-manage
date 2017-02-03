from oscarapi.app import RESTApiApplication
from ad_manage.searchapi.urls import urlpatterns
    class SearchRESTApiApplication(RESTApiApplication):

        def get_urls(self):
            urls = super(SearchRESTApiApplication, self).get_urls()
            return urlpatterns + urls
            
application = SearchRESTApiApplication()

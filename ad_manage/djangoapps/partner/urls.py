from django.contrib.auth.decorators import login_required
from django.conf.urls import patterns, url

from .views import PartnerMentorCreateView

urlpatterns = [
    url(r'^become-mentor/$', login_required(PartnerMentorCreateView.as_view()), name="become-mentor"),
]

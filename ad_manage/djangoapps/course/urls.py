from django.conf.urls import patterns, url

from .views import (
                    CourseListIndexTemplateView,
                    )

urlpatterns = [
    url(r'^$', CourseListIndexTemplateView.as_view(), name="course-list-index"),
]

from django.conf.urls import patterns, url

from .views import (
                    CourseListIndexTemplateView,
                    CourseCreateView,
                    )

urlpatterns = [
    url(r'^$', CourseListIndexTemplateView.as_view(), name="course-list-index"),
    url(r'^course/create/$', CourseCreateView.as_view(), name="course-create"),

]

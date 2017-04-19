from django.conf.urls import url

from . import views

urlpatterns = [
    #...
    url(r'^become-mentor/$', views.CustomerMentorCompleteProfileStepOne.as_view(), name='become-mentor-step1'),
    url(r'^become-mentor/step-2/$', views.CustomerMentorCompleteProfileStepTwo.as_view(), name='become-mentor-step2'),

    #url(r'^mentor/create-course$', views.year_archive, name='create-course'),

    #...
]

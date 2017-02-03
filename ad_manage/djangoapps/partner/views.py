from django.shortcuts import redirect, render
from django.utils.translation import ugettext_lazy as _
from django.views.generic import View

from customer.models import CustomerProfile
from .models import Partner

# Create your views here or die

class PartnerMentorCreateView(View):

    template_name = 'ad_manage/mentor/become_mentor_view.html'

    def get(self, request):
        # need to allow GET to make Undo link in PartnerUserUnlinkView work
        UserL = request.user
        if UserL.customer_profile.is_mentor:
            return redirect('customer:profile-view')
        else:
            return render(request, self.template_name)

    def post(self, request):
        UserL = request.user
        if UserL.customer_profile.is_mentor:
            # if for some reason, hes a mentor and he post anyways, well fuck u
            return redirect('customer:profile-view')
        else:
            new_mentor = Partner(user=UserL,name=UserL.get_full_name())
            UserL.customer_profile.status = CustomerProfile.CANDIDATE
            UserL.customer_profile.save()
            new_mentor.save()
            return render(request, self.template_name, {"mentor_created":1})

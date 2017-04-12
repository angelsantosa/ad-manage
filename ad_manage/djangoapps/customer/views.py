from oscar.apps.customer.views import AccountRegistrationView as CoreAccountRegistrationView
from django.views.generic.edit import FormView
from django.core.urlresolvers import reverse_lazy
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from .models import CustomerDocument
from document_manager.models import Document
from .perms_becomementor import second_step, first_step

from .forms import EmailUserCreationForm, StepOneForm, StepTwoForm

# Create your views here or die.

class AccountRegistrationView(CoreAccountRegistrationView):
    form_class = EmailUserCreationForm


class CustomerMentorCompleteProfileStepOne(FormView):

    template_name = 'customer/complete_profile_step1.html'
    form_class = StepOneForm
    success_url = "/"

    @method_decorator(user_passes_test(first_step, "/"))
    def dispatch(self, *args, **kwargs):
        return super(CustomerMentorCompleteProfileStepOne, self).dispatch(*args, **kwargs)

    def get_initial(self):
        """
        Returns the initial data to use for forms on this view.
        """
        Usr = self.request.user
        Profi = Usr.customer_profile

        init = {
            'first_name': Usr.first_name,
            'last_name': Usr.last_name,
            'email': Usr.email,
            'gender': Profi.gender,
            'about_me': Profi.about_me,
            'country_name': Profi.country_name,
            'state_name': Profi.state_name,
            'address_field_one': Profi.address_field_one,
            'address_field_two': Profi.address_field_two,
            'postal_code': Profi.postal_code,
            'outdoor_number': Profi.outdoor_number,
            'internal_number': Profi.internal_number,
        }
        return init

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        Usr = self.request.user
        Profi = Usr.customer_profile

        Usr.first_name = form.cleaned_data['first_name']
        Usr.last_name = form.cleaned_data['last_name']
        Usr.email = form.cleaned_data['email']

        Profi.gender = form.cleaned_data['gender']
        Profi.about_me = form.cleaned_data['about_me']

        Profi.country_name = form.cleaned_data['country_name']
        Profi.state_name = form.cleaned_data['state_name']
        Profi.address_field_one = form.cleaned_data['address_field_one']
        Profi.address_field_two = form.cleaned_data['address_field_two']
        Profi.postal_code = form.cleaned_data['postal_code']
        Profi.outdoor_number = form.cleaned_data['outdoor_number']
        Profi.internal_number = form.cleaned_data['internal_number']

        Usr.save()
        Profi.save()

        return super(CustomerMentorCompleteProfileStepOne, self).form_valid(form)

class CustomerMentorCompleteProfileStepTwo(FormView):

    template_name = 'customer/complete_profile_step2.html'
    form_class = StepTwoForm
    success_url = "/"

    @method_decorator(user_passes_test(second_step, login_url="/"))
    def dispatch(self, *args, **kwargs):
        return super(CustomerMentorCompleteProfileStepTwo, self).dispatch(*args, **kwargs)

    def get_initial(self):
        """
        Returns the initial data to use for forms on this view.
        """
        Usr = self.request.user
        Profi = Usr.customer_profile

        init = {
        'phone': Profi.phone
        }
        return init

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        Usr = self.request.user
        Profi = Usr.customer_profile
        doc_ide = CustomerDocument(doc_file=form.cleaned_data['doc_ide'] , doc_type=Document.DOCUMENT_TYPE_ID, user = self.request.user)
        doc_adrrs = CustomerDocument(doc_file=form.cleaned_data['doc_adrrs'] , doc_type=Document.DOCUMENT_TYPE_ADDRESS, user = self.request.user)
        doc_free_nigga = CustomerDocument(doc_file=form.cleaned_data['doc_free_nigga'] , doc_type=Document.DOCUMENT_TYPE_PENAL, user = self.request.user)

        Profi.phone = form.cleaned_data['phone']

        doc_ide.save()
        doc_adrrs.save()
        doc_free_nigga.save()
        Profi.save()

        return super(CustomerMentorCompleteProfileStepTwo, self).form_valid(form)

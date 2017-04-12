from django import forms
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import pgettext_lazy

from oscar.core.compat import get_user_model
from oscar.apps.customer.forms import generate_username
from oscar.apps.customer.forms import EmailUserCreationForm as CoreEmailUserCreationForm
from django import forms
from .models import CustomerProfile
# Create your forms here or die.
User = get_user_model()

class EmailUserCreationForm(CoreEmailUserCreationForm):

    first_name = forms.CharField(
        label=_('First Name'),required=True,max_length=30)
    last_name = forms.CharField(
        label=_('Last Name'),required=True,max_length=30)
    date_of_birth = forms.DateField(required=True)

    class Meta:
        model = User
        fields = ('first_name','last_name','email')

    def save(self, commit=True):
        user = super(EmailUserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])

        if 'username' in [f.name for f in User._meta.fields]:
            user.username = generate_username()
        if commit:
            user.save()
            user_profile = CustomerProfile(user=user,birth_date=self.cleaned_data['date_of_birth'])
            user_profile.save()
        return user

class StepOneForm(forms.Form):

    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)
    email = forms.EmailField()

    gender = forms.ChoiceField(choices=CustomerProfile.GENDER_CHOICES)

    about_me = forms.CharField(widget=forms.Textarea)

    country_name = forms.CharField(max_length=100)
    state_name = forms.CharField(max_length=100)
    address_field_one = forms.CharField(max_length=100)
    address_field_two = forms.CharField(max_length=100)
    postal_code = forms.IntegerField()
    outdoor_number = forms.CharField(max_length=100)
    internal_number = forms.CharField(max_length=100)

class StepTwoForm(forms.Form):

    doc_ide = forms.FileField()
    doc_adrrs = forms.FileField()
    doc_free_nigga = forms.FileField()

    doc_diplom = forms.FileField(required=False)
    doc_knowledge = forms.FileField(required=False)

    phone = forms.CharField(max_length=75)

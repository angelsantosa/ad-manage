from django import forms
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import pgettext_lazy

from oscar.core.compat import get_user_model
from oscar.apps.customer.forms import generate_username
from oscar.apps.customer.forms import EmailUserCreationForm as CoreEmailUserCreationForm

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

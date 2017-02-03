from oscar.apps.customer.views import AccountRegistrationView as CoreAccountRegistrationView
from .forms import EmailUserCreationForm

# Create your views here or die.

class AccountRegistrationView(CoreAccountRegistrationView):
    form_class = EmailUserCreationForm

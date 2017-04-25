from .models import CustomerDocument, CustomerProfile
from document_manager.models import Document

def first_step(user):

    p = user.customer_profile
    u = user

    if (u.email and u.first_name and u.last_name and p.gender and p.country_name and p.about_me and p.birth_date):
        return True
    else:
        return False

def active_mentor(user):
    p = user.customer_profile
    return True if p.status == CustomerProfile.MENTOR else False

def second_step(user):

    p = user.customer_profile
    u = user
    files = CustomerDocument.objects.filter(user_id=u)
    filist = list(files)
    doc_types = []

    if not (len(filist) >= 3 or p.phone):
        return True
    else:
        doc_types = [x.get_document_type() for x in files]
        if not (Document.DOCUMENT_TYPE_ID in doc_types or Document.DOCUMENT_TYPE_ADDRESS in doc_types or Document.DOCUMENT_TYPE_PENAL in doc_types):
            return True
        else:
            return False

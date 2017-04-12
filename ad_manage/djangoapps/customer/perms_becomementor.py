from .models import CustomerDocument
from document_manager.models import Document

def first_step(user):

    p = user.customer_profile
    u = user

    if not u.username:
        print "################"

    return True if not (u.email or u.username or u.first_name or u.last_name or p.gender or p.country_name or p.about_me) else False

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
        return True if not (Document.DOCUMENT_TYPE_ID in doc_types or Document.DOCUMENT_TYPE_ADDRESS in doc_types or Document.DOCUMENT_TYPE_PENAL in doc_types) else False

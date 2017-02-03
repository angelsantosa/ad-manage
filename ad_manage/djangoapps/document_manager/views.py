# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse

from .models import Document
from .forms import DocumentForm

def list(request):
    # Handle file upload
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = Document(doc_file = request.FILES['docfile'], doc_type=Document.DOCUMENT_TYPE_ID)
            newdoc.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect(reverse('document_manager.views.list'))
    else:
        form = DocumentForm() # A empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()

    # Render list page with the documents and the form
    return render_to_response(
        'document_manager/list.html',
        {'documents': documents, 'form': form},
        context_instance=RequestContext(request)
    )
# -*- coding: latin-1 -*-

from django.db import models

from django.utils.translation import ugettext_noop

# Create your models here.


class Document(models.Model):


    DOCUMENT_TYPE_ID = 1
    DOCUMENT_TYPE_ADDRESS = 2
    DOCUMENT_TYPE_PENAL = 3
    DOCUMENT_TYPE_KNOWLEDGE = 4
    DOCUMENT_TYPE_DIPLOMA = 5
    DOCUMENT_TYPE_PHOTO = 6
    DOCUMENT_TYPE_PROGRAM = 7
    DOCUMENT_TYPE_MATERIAL = 8


    DOCUMENT_TYPE_CHOICES = (
        (DOCUMENT_TYPE_ID, ugettext_noop('Id')),
        (DOCUMENT_TYPE_ADDRESS, ugettext_noop('Address')),
        (DOCUMENT_TYPE_PENAL, ugettext_noop('Penal')),
        (DOCUMENT_TYPE_KNOWLEDGE, ugettext_noop('Knowledge')),
        (DOCUMENT_TYPE_DIPLOMA, ugettext_noop('Diploma')),
        (DOCUMENT_TYPE_PHOTO, ugettext_noop('Photo')),
        (DOCUMENT_TYPE_PROGRAM, ugettext_noop('Program')),
        (DOCUMENT_TYPE_MATERIAL, ugettext_noop('Material')),
    )

    # Las opciones que describen el estado del archivo
    DOCUMENT_STATUS_FILE_MISSING = 0
    DOCUMENT_STATUS_LOADDED = 1
    DOCUMENT_STATUS_APPROVINGLY = 2
    DOCUMENT_STATUS_APPROVED = 3
    DOCUMENT_STATUS_RELOAD = 4
    DOCUMENT_STATUS_SUGGESTED = 5
    DOCUMENT_STATUS_CHOICES = (
        (DOCUMENT_STATUS_APPROVED, ugettext_noop('Approved')),
        (DOCUMENT_STATUS_FILE_MISSING, ugettext_noop('File Missing')),
        (DOCUMENT_STATUS_APPROVINGLY, ugettext_noop('Approvingly')),
        (DOCUMENT_STATUS_RELOAD, ugettext_noop('Reload')),
        (DOCUMENT_STATUS_SUGGESTED, ugettext_noop('Suggested')),
        (DOCUMENT_STATUS_LOADDED, ugettext_noop('Loadded'))
    )


    # Las opciones que describen el estado del perfil

    """Collected info for general documents
    """

    doc_file = models.FileField(upload_to='uploads/')

    name = models.CharField(max_length=255)

    doc_type = models.IntegerField(
        db_index=True,
        choices=DOCUMENT_TYPE_CHOICES,
        help_text='Establece el tipo de documento'
    )

    status = models.IntegerField(
        null=False, db_index=True, default=DOCUMENT_STATUS_FILE_MISSING,
        choices=DOCUMENT_STATUS_CHOICES,
        help_text='Estado del documento'
    )

    extension = models.CharField(max_length=4, blank=True,
                                            help_text='Extensión del documento')

    uploaded_at = models.DateTimeField(null=True,
                                                  help_text='Fecha en de carga del documento ')

    @property
    def get_document_status_choice(self, choice):
        return dict(self.DOCUMENT_STATUS_CHOICES).get(choice)

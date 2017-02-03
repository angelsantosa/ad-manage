# -*- coding: latin-1 -*-

from django.db import models

from django.utils import timezone
from django.utils.translation import pgettext_lazy
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ugettext_noop

from oscar.apps.partner.abstract_models import AbstractPartner
from oscar.core.compat import AUTH_USER_MODEL
# your custom models go here

class Partner(AbstractPartner):

    user = models.OneToOneField(
    	AUTH_USER_MODEL, 
    	unique=True, 
    	db_index=True, 
    	null= True,
    	related_name='partner', 
    	verbose_name=_("Users"), 
    	help_text='Relacionar los datos de mentor con el usuario')
	    
    modified_at = models.DateTimeField(default=timezone.now,
                                       help_text='Fecha de actualización del registro')

    def save(self, *args, **kwargs):
        self.modified_at = timezone.now()
        return super(Partner, self).save(*args, **kwargs)

from oscar.apps.partner.models import *
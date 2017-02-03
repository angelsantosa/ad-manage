# -*- coding: latin-1 -*-

from django.db import models

from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ugettext_noop

from oscar.core.compat import AUTH_USER_MODEL
from document_manager.models import Document
from django.contrib.staticfiles.templatetags.staticfiles import static
# Create your models here.



class CustomerDocument(Document):

	user = models.ForeignKey(
		AUTH_USER_MODEL,
		on_delete=models.CASCADE,
	)

class CustomerProfile(models.Model):

	# Las opciones que describen el estado del perfil
	DEFAULT_AVATAR = static('img/default-avatar.jpg')
	MALE = 'M'
	FEMALE = 'F'
	OTHER = 'O'
	GENDER_CHOICES = (
		(MALE, ugettext_noop('Male')),
		(FEMALE, ugettext_noop('Female')),
		(OTHER, ugettext_noop('Other'))
	)
	APPRENTICE = 0
	CANDIDATE = 1
	MENTOR = 2
	PROFILE_STATUS_CHOICES = (
		(APPRENTICE, ugettext_noop('Apprentice')),
		(CANDIDATE, ugettext_noop('Mentor Candidate')),
		(MENTOR, ugettext_noop('Mentor'))
	)

	INCOMPLETE = 0
	COMPLETE = 1

	VALIDATION_STATUS_CHOICES = (
		(INCOMPLETE, ugettext_noop('Incomplete')),
		(COMPLETE, ugettext_noop('Complete')),
	)

	user = models.OneToOneField(
		AUTH_USER_MODEL,
		unique=True,
		db_index=True,
		null= False,
		related_name='customer_profile',
		verbose_name=_("Users"),
		help_text='Relacionar los datos del perfil con el usuario'
	)

	avatar = models.CharField(max_length=250, blank=True, help_text="Avatar")

	birth_date = models.DateField(blank=True, null=True, help_text='Fecha de nacimietno')

	status = models.IntegerField(
		null=False, default=APPRENTICE,
		choices=PROFILE_STATUS_CHOICES,
		help_text='Estado del perfíl de usuario'
	)

	validation_status = models.IntegerField(
		null=False, default=INCOMPLETE,
		choices=VALIDATION_STATUS_CHOICES,
		help_text='Estado de datos de perfil'
	)
	gender = models.CharField(
		blank=True,help_text="Genero", choices=GENDER_CHOICES, max_length=1, default=OTHER
	)

	about_me = models.CharField(max_length=250, blank=True,
									help_text="Acerca del mentor, pequeña description")

	phone = models.CharField(max_length=75, blank=True,
							 help_text='Teléfono de contacto')

	occupation = models.CharField(max_length=100, blank=True,
								  help_text='Ocupación del mentor, profesión u oficio')
	educational_name = models.CharField(max_length=100, blank=True,
										help_text='Nombre de la institución educativa del mentor')
	work_name = models.CharField(max_length=250, blank=True,
								 help_text='Nombre del llugar de trabajo')

	emergency_contact_name = models.CharField(max_length=250, blank=True,
											  help_text='Nombre de contacto en caso de emergencia')
	emergency_contact_email = models.CharField(max_length=250, blank=True,
											   help_text='Correo del contacto en caso de emergencia')
	emergency_contact_relationship = models.CharField(max_length=250, blank=True,
													  help_text='Relación con el contacto en caso de emergencia')
	emergency_contact_phone = models.CharField(max_length=250, blank=True,
											   help_text='Teléfono del contacto en caso de emergencia')

	country_name = models.CharField(max_length=250, blank=True,
									help_text='Nombre del país residencia del mentor')
	state_name = models.CharField(max_length=250, blank=True,
								  help_text='Estado de residencia del mentor')
	address_field_one = models.CharField(max_length=250, blank=True,
										 help_text='Campo para datos de dirección')
	address_field_two = models.CharField(max_length=250, blank=True,
										 help_text='Campo para datos de dirección extendido')
	postal_code = models.CharField(max_length=250, blank=True,
								   help_text='Código postal de residencia del mentor')
	outdoor_number = models.CharField(max_length=250, blank=True,
									  help_text='Número exterior de residencia del mentor')
	internal_number = models.CharField(max_length=250, blank=True,
									   help_text='Número interior de residencia del mentor')

	location_latitude = models.DecimalField(max_digits=18, decimal_places=10, null=True,
											help_text='Almacena la latitud en la ubicación del mentor')
	location_longitude = models.DecimalField(max_digits=18, decimal_places=10, null=True,
											 help_text='Almacena la longitud en la ubicación del mentor')

	created_at = models.DateTimeField(default=timezone.now,
									  help_text='Fecha de creación del registro')
	modified_at = models.DateTimeField(default=timezone.now,
									   help_text='Fecha de actualización del registro')


	@property
	def is_aprentice(self):
		"""
		Convenience method that returns a boolean indicating
		the user is Aprentice.
		"""
		return int(self.status) == self.APPRENTICE

	@property
	def is_active_mentor(self):
		"""
		Convenience method that returns a boolean indicating
		the user is Mentor.
		"""
		return int(self.status) == self.MENTOR

	@property
	def is_candidate(self):
		"""
		Convenience method that returns a boolean indicating
		the user is Mentor.
		"""
		return int(self.status) == self.CANDIDATE

	@property
	def is_mentor(self):
		"""
		Convenience method that returns a boolean indicating
		the user is Mentor.
		"""
		return int(self.status) > self.APPRENTICE

	@property
	def is_profile_complete(self):
		return True if int(self.validation_status) == self.COMPLETE else False

	@property
	def get_avatar(self):
		return self.DEFAULT_AVATAR if not self.avatar else self.avatar


from oscar.apps.customer.models import *

# -*- coding: latin-1 -*-

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_noop
from django_countries.fields import CountryField

from haystack.utils.geo import Point

from oscar.apps.catalogue.abstract_models import AbstractCategory
from oscar.apps.catalogue.abstract_models import AbstractProduct
from oscar.apps.catalogue.abstract_models import AbstractProductAttribute

from document_manager.models import Document

class Category(AbstractCategory):
	icon = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Ícono de la categoría'
	)

class Product(AbstractProduct):

	# Los estados en los que se puede encontrar la publicación del curso
	PUBLISHED = 0
	DRAFT = 1
	REMOVED = 2
	PUBLISH_COURSE_STATUS_CHOICES = (
		(PUBLISHED, ugettext_noop('Published')),
		(DRAFT, ugettext_noop('Draft')),
		(REMOVED, ugettext_noop('Removed')),
	)

	# El nivel de aprendiz para el que esta dirigido el curso
	NEWBIE = 0
	NOVICE = 1
	ROOKIE = 2
	BEGGINER = 3
	TALENTED = 4
	SKILLED = 5
	INTERMEDIATE = 6
	SKILLFUL = 7
	PROFICIENT = 8
	EXPERIENCED = 9
	ADVANCED = 10
	SENIOR = 11
	EXPERT = 12
	COURSE_LEVEL_CHOICES = (
		(NOVICE, ugettext_noop('Novice')),
		(BEGGINER, ugettext_noop('Begginer')),
		(INTERMEDIATE, ugettext_noop('Intermediate')),
		(ADVANCED, ugettext_noop('Advanced')),
		(EXPERT, ugettext_noop('Expert')),
	)

	SPANISH = 'es'
	ENGLISH = 'en'
	GERMAN = 'de'
	LANGUAGE_TYPE_CHOICES = (
		(ENGLISH, ugettext_noop('English')),
		(SPANISH, ugettext_noop('Spanish')),
		(GERMAN, ugettext_noop('German')),
	)

	# Las opciones que describen el modo elegido de ubicación
	PROVIDED_BY_APPRENTICE = 0
	PROVIDED_BY_MENTOR = 1

	LOCATION_MODE_CHOICES = (
		(PROVIDED_BY_APPRENTICE, ugettext_noop('Provided by the apprentice')),
		(PROVIDED_BY_MENTOR, ugettext_noop('Provided by the mentor')),
	)

	# Las opciones que describen el tipo de ubicación elegido por el mentor
	PUBLIC_PLACE = 0
	OFFICE = 1
	HOUSE = 2
	COFFEE = 3

	LOCATION_TYPE_CHOICES = (
		(PUBLIC_PLACE, ugettext_noop('Public Place')),
		(HOUSE, ugettext_noop('House')),
		(OFFICE, ugettext_noop('Office')),
		(COFFEE, ugettext_noop('Coffee')),
	)

	publish_course_status = models.IntegerField(
		db_index=True, default=DRAFT,
		choices=PUBLISH_COURSE_STATUS_CHOICES,
		help_text='Establece el tipo de nivel para publicación del curso'
	)
	course_level = models.IntegerField(
		db_index=True, default=NOVICE,
		choices=COURSE_LEVEL_CHOICES,
		help_text='Establece el tipo de nivel para publicación del curso'
	)
	course_language = models.CharField(
		db_index=True, default=SPANISH,
		choices=LANGUAGE_TYPE_CHOICES,
		max_length=2,
		help_text='Establece el lenguaje en el que se presentara el curso'
	)
	location_mode = models.IntegerField(
		db_index=True, default=PROVIDED_BY_MENTOR,
		choices=LOCATION_MODE_CHOICES,
		help_text='Establece el modo de ubicación para publicación del curso'
	)
	location_type = models.IntegerField(
		db_index=True, default=PUBLIC_PLACE,
		choices=LOCATION_TYPE_CHOICES,
		help_text='Establece el tipo de ubicación para publicación del curso'
	)
	minimum_apprentices = models.IntegerField(
		blank=True, null=True,
		help_text='Número mínimo de aprendices'
	)
	maximum_apprentices = models.IntegerField(
		blank=True, null=True,
		help_text='Número máximo de aprendices'
	)
	date_start = models.DateTimeField(
		null=True, default=None,
		help_text='Fecha de inicio del curso'
	)
	date_end = models.DateTimeField(
		null=True, default=None,
		help_text='Fecha de fin del urso'
	)
	location_country = CountryField(
		blank=True, null=True,
		help_text='Establecer el país de la ubicación de la publicación del curso'
	)
	location_address = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Campo para datos de ubicación calle'
	)
	location_postal_code = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Código postal de la ubicación'
	)
	location_outdoor_number = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Número exterior de la ubicación'
	)
	location_internal_number = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Número interior de la ubicación'
	)
	location_state = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Estado / Provinca de la ubicación'
	)
	location_city = models.CharField(
		max_length=250, blank=True, null=True,
		help_text='Ciudad de la ubicación'
	)
	location_latitude = models.FloatField(
		null=True,
		help_text='Almacena la latitud de la ubicación',
		default=133.7
	)
	location_longitude = models.FloatField(
		null=True,
		help_text='Almacena la longitud de la ubicación',
		default=133.7
	)
	certificate_available = models.BooleanField(
		default=False,
		help_text='Is there a certificate available?'
	)
	previous_knowledge = models.CharField(
		blank=True, null=True, max_length=255,
		help_text='Previous knowledge '
	)
	extra_material = models.CharField(
		blank=True, null=True, max_length=255,
		help_text='Additional resources or material'
	)
	course_format = models.CharField(
		blank=True, null=True, max_length=255,
		help_text='Previous knowledge '
	)
	faq = models.CharField(
		blank=True, null=True, max_length=255,
		help_text='Frecuently Asked Questions'
	)

	@property
	def __str__(self):
		return self.title

	def coordinates(self):
		return Point(self.location_longitude, self.location_latitude)

	# Agregar fotos se realiza con API

	# Agregar programa del curso con API

	# Agregar materiales del curso con API

class CourseSchedule(models.Model):
	"""Collected info for Publish Course Schedule
	"""

	class Meta(object):
		app_label = "course"
		db_table = "course_schedule"

	MONDAY = 0
	TUESDAY = 1
	WEDNESDAY = 2
	THURSDAY = 3
	FRIDAY = 4
	SATURDAY = 5
	SUNDAY = 6

	DAYS_OF_WEEK = (
		(MONDAY, ugettext_noop('Monday')),
		(TUESDAY, ugettext_noop('Tuesday')),
		(WEDNESDAY, ugettext_noop('Wednesday')),
		(THURSDAY, ugettext_noop('Thursday')),
		(FRIDAY, ugettext_noop('Friday')),
		(SATURDAY, ugettext_noop('Saturday')),
		(SUNDAY, ugettext_noop('Sunday')),
	)

	course = models.ForeignKey(
		Product, db_index=True, related_name='publish_course_schedule',
		help_text='Establece la relación con el curso publicado'
	)

	day_of_week = models.IntegerField(
		db_index=True, default=MONDAY,
		choices=DAYS_OF_WEEK,
		help_text='Establece el horario de calendario para publicación del curso'
	)

	time_start = models.TimeField(
		verbose_name=ugettext_noop("Start")
	)

	time_end = models.TimeField(
		verbose_name=ugettext_noop("End")
	)

	modified_at = models.DateTimeField(
		null=True,
		help_text='Fecha en la que se modifica el horario'
	)

	def save(self, *args, **kwargs):
		self.modified_at = timezone.now()
		return super(CourseSchedule, self).save(*args, **kwargs)

class CourseResource(Document):
	"""Collected info for Publish Course Resource
	"""
	product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
    )

from oscar.apps.catalogue.models import *  # noqa

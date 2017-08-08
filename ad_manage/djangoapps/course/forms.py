from django import forms
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import pgettext_lazy

from oscar.core.loading import get_model

Course = get_model("catalogue", "Product")
Category_model = get_model("catalogue","Category")
ProductClass_model = get_model("catalogue","ProductClass")

class CreateCourseFormStep1(forms.Form):
    name = forms.CharField(label= _('Nombre del curso'), required=True)
    description = forms.CharField(label= _('Descripcion del curso'), required=True)
    category = forms.ModelChoiceField(queryset=Category_model.objects.all(), empty_label=None)
    course_language = forms.ChoiceField(choices=Course.LANGUAGE_TYPE_CHOICES,label= _('Lenguaje del curso'), required=True)
    extra_material = forms.CharField(label= _('Material extra para el curso'), required=False)

class CreateCourseFormStep2(forms.Form):
    course_class = forms.ModelChoiceField(queryset=ProductClass_model.objects.all(), empty_label=None)
    course_stockrecord = forms.CharField(label= _('Numero de aprendices'), required=True)
    course_level = forms.ChoiceField(choices=Course.COURSE_LEVEL_CHOICES,label= _('Nivel del curso'), required=True)


class CreateCourseFormStep3(forms.Form):
    date_start = forms.DateField(label= _('Fecha de inicio'), required=True)
    date_end = forms.DateField(label= _('Decha termino del curso'), required=True)


class CreateCourseFormStep4(forms.Form):
    location_type = forms.ChoiceField(choices=Course.LOCATION_TYPE_CHOICES,label= _('Tipo de localizacion'), required=True)
    location_country = forms.CharField(label= _('Pais'), required=True)
    location_state = forms.CharField(label= _('Estado'), required=True)
    location_city = forms.CharField(label= _('Ciudad'), required=True)
    location_postal_code = forms.CharField(label= _('Codigo Postal'), required=True)
    location_address = forms.CharField(label= _('Direccion'), required=True)
    location_outdoor_number = forms.CharField(label= _('Numero exterior'), required=True)
    location_internal_number = forms.CharField(label= _('Numero interior'), required=True)


class CreateCourseFormStep5(forms.Form):
    course_price = forms.DecimalField(label= _('Precio'), required=True, decimal_places=2, max_digits=12)
    currency = forms.CharField(label= _('Moneda'), required=True)


class CreateCourseFormStep6(forms.Form):
    course_image = forms.ImageField(label= _('Imagen'), required=False)

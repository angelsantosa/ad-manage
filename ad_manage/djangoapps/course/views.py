from django.utils.translation import ugettext_lazy as _
from django.views.generic import TemplateView
from formtools.wizard.views import SessionWizardView

from .forms import CourseDummyForm

from oscar.core.loading import get_model

FORMS_CREATE_WIZARD = [
        ("step1", CourseDummyForm),
        ("step2", CourseDummyForm),
        ("step3", CourseDummyForm),
        ("step4", CourseDummyForm),
        ("step5", CourseDummyForm),
        ("step6", CourseDummyForm),
         ]

TEMPLATES_CREATE_WIZARD = {
            "step1": "course/create/step1.html",
            "step2": "course/create/step2.html",
            "step3": "course/create/step3.html",
            "step4": "course/create/step4.html",
            "step5": "course/create/step5.html",
            "step6": "course/create/step6.html",
             }

CourseStock = get_model("partner", "StockRecord")
Course = get_model("catalogue", "Product")
Cat = get_model("catalogue","Category")

class CourseListIndexTemplateView(TemplateView):
    template_name = 'ad_manage/index/course_list_index.html'

    def get_context_data(self, **kwargs):

        context = super(CourseListIndexTemplateView, self).get_context_data(**kwargs)
        context["courses"] = self.get_courses()
        return context

    def get_courses(self):
        courses = []

        published_courses = CourseStock.objects.filter(product__publish_course_status=Course.PUBLISHED).order_by("date_created")

        for course in published_courses:
            course_data = course.product
            category = Cat.objects.get(product=course_data)
            partner = course.partner.user
            partner_profile = partner.customer_profile
            course_data = {
                "name": course_data.title, # Nombre del curso
                "mentor_full_name": partner.get_full_name(), # Nombre del partner
                "mentor_avatar": partner_profile.get_avatar, # Avatr del partner
                "category_image": category.image.url if category.image else None, # imagen de la categoria
                "currency": course.price_currency, # MSN OR USD askjvfnh
                "price": course.price_excl_tax, # TODO se obtiene el precio sin iva, leer como combinar ambos precios
                "country": course_data.location_country, # Pais del curso
                "city": course_data.location_city, # ciudad del curso
                "url": course_data.get_absolute_url(),#TODO url del curso (se genera en template)
            }
            courses.append(course_data)

        return courses


class CourseCreateView(SessionWizardView):

    form_list = FORMS_CREATE_WIZARD

    def get_template_names(self):
        return [TEMPLATES_CREATE_WIZARD[self.steps.current]]

    def done(self, form_list, **kwargs):
        print("lul")

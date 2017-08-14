import os, string, random
from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse_lazy
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.views.generic import TemplateView
from formtools.wizard.views import SessionWizardView

from .forms import CreateCourseFormStep1, CreateCourseFormStep2, CreateCourseFormStep3, CreateCourseFormStep4, CreateCourseFormStep5, CreateCourseFormStep6

from oscar.core.loading import get_model
from customer.perms_becomementor import second_step, first_step, active_mentor

FORMS_CREATE_WIZARD = [
        ("step1", CreateCourseFormStep1),
        ("step2", CreateCourseFormStep2),
        ("step3", CreateCourseFormStep3),
        ("step4", CreateCourseFormStep4),
        ("step5", CreateCourseFormStep5),
        ("step6", CreateCourseFormStep6),
         ]

TEMPLATES_CREATE_WIZARD = {
            "step1": "course/create/default_step.html",
            "step2": "course/create/default_step.html",
            "step3": "course/create/default_step.html",
            "step4": "course/create/default_step.html",
            "step5": "course/create/default_step.html",
            "step6": "course/create/step6.html",
             }

Partner = get_model("partner", "Partner")
CourseStock = get_model("partner", "StockRecord")
Course = get_model("catalogue", "Product")
ProductImage = get_model("catalogue", "ProductImage")
Cat = get_model("catalogue","Category")
ProductCategory = get_model("catalogue","ProductCategory")

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

    file_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'photos'))

    form_list = FORMS_CREATE_WIZARD
    complete_profile_url = reverse_lazy("customeri:become-mentor-step1")

    def get(self, request, *args, **kwargs):
        if (active_mentor(self.request.user)):
            self.storage.reset()
            # reset the current step to the first step.
            self.storage.current_step = self.steps.first
            return self.render(self.get_form())
        else:
            return HttpResponseRedirect(self.complete_profile_url)

    def get_template_names(self):
        return [TEMPLATES_CREATE_WIZARD[self.steps.current]]

    def sku_generator(self, size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))

    def done(self, form_list, form_dict, **kwargs):

        UserPartnerId = Partner.objects.get(user_id=self.request.user.id)

        s1 = form_dict['step1'].cleaned_data
        s2 = form_dict['step2'].cleaned_data
        s3 = form_dict['step3'].cleaned_data
        s4 = form_dict['step4'].cleaned_data
        s5 = form_dict['step5'].cleaned_data
        s6 = form_dict['step6'].cleaned_data

        NewCourse = Course(
            title= s1['name'],
            description= s1['description'],
            extra_material= s1['extra_material'],
            course_language= s1['course_language'],

            product_class= s2['course_class'],
            course_level= s2['course_level'],

            date_start= s3['date_start'],
            date_end= s3['date_end'],

            location_type= s4['location_type'],
            location_country= s4['location_country'],
            location_state= s4['location_state'],
            location_city= s4['location_city'],
            location_postal_code= s4['location_postal_code'],
            location_address= s4['location_address'],
            location_outdoor_number= s4['location_outdoor_number'],
            location_internal_number= s4['location_internal_number'],

            publish_course_status=Course.PUBLISHED,
        )
        NewCourse.save()

        NewProductCategory = ProductCategory(
            product= NewCourse,
            category= s1['category'],
        )

        NewCourseStock = CourseStock(
            product = NewCourse,
            partner = UserPartnerId,
            partner_sku= self.sku_generator(),
            num_in_stock= s2['course_stockrecord'],
            price_currency= s5['currency'],
            price_excl_tax= s5['course_price'],
            cost_price= s5['course_price'],

        )
        NewCourseImage = ProductImage(
            product=NewCourse,
            original=s6['course_image'],
        )
        NewProductCategory.save()
        NewCourseStock.save()
        NewCourseImage.save()
        return HttpResponseRedirect(NewCourse.get_absolute_url())

from oscar.apps.catalogue.views import ProductDetailView as CoreProductDetailView
from oscar.core.loading import get_model

CourseStock = get_model("partner", "StockRecord")
Course = get_model("catalogue", "Product")
Cat = get_model("catalogue","Category")

class ProductDetailView(CoreProductDetailView):

    def get_context_data(self, **kwargs):
        ctx = super(ProductDetailView, self).get_context_data(**kwargs)
        ctx['mentor'] = self.get_mentor_info()
        return ctx

    def get_mentor_info(self, **kwargs):
        product_pk = self.kwargs.get(self.pk_url_kwarg, None)
        course = CourseStock.objects.get(product=product_pk)
        course_indeed = course.product
        category = Cat.objects.get(product=course_indeed)
        partner = course.partner.user
        partner_profile = partner.customer_profile

        mentor_data = {
            "full_name": partner.get_full_name(), # Nombre del partner
            "avatar": partner_profile.get_avatar, # Avatr del partner
            "category_image": category.image.url if category.image else None, # imagen de la categoria
            "country": course_indeed.location_country, # Pais del curso
            "city": course_indeed.location_city, # ciudad del curso
        }

        return mentor_data

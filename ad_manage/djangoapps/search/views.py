from django.views.generic import TemplateView
from django.utils.translation import ugettext as _

from oscar.core.loading import get_model

Category = get_model('catalogue', 'Category')
Course = get_model('catalogue', 'Product')

# Create your views here or die.
class SearchV2View(TemplateView):
    template_name = 'ad_manage/search/search.html'

    def get_context_data(self, **kwargs):
        context = super(SearchV2View, self).get_context_data(**kwargs)

        # Generar las categorias y subcategorias para el selector
        categories = []
        
        for category in Category.objects.filter(depth=1):
            subcategories = []
            for subcategory in category.get_descendants():
                subcategories.append([subcategory.id, _(subcategory.name)])
            new_category = [_(category.name), category.id, category.icon, subcategories]
            categories.append(new_category)

        context['fields'] = {
            'categories': {
                'options': categories
            },
            'course_type': {
               'options': [(choice[0], _(choice[1])) for choice in Course.COURSE_LEVEL_CHOICES],  # pylint: disable=translation-of-non-string
            },
            'course_level': {
                'options': [(choice[0], _(choice[1])) for choice in Course.COURSE_LEVEL_CHOICES],  # pylint: disable=translation-of-non-string
            },   'course_language': {
                'options': [(choice[0], _(choice[1])) for choice in Course.LANGUAGE_TYPE_CHOICES],  # pylint: disable=translation-of-non-string
            }
        }
        print context
        context["backbone"] = 1

        return context

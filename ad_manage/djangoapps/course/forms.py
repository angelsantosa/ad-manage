from django import forms

class CourseDummyForm(forms.Form):
    dummy = forms.CharField(widget=forms.HiddenInput, required=False)


"""
class CreateCourseFormStep1(forms.Form):


class CreateCourseFormStep2(forms.Form):


class CreateCourseFormStep3(forms.Form):


class CreateCourseFormStep4(forms.Form):


class CreateCourseFormStep5(forms.Form):


class CreateCourseFormStep6(forms.Form):

"""

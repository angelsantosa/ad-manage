"""Auth pipeline definitions.

Auth pipelines handle the process of authenticating a user. They involve a
consumer system and a provider service. The general pattern is:

    1. The consumer system exposes a URL endpoint that starts the process.
    2. When a user visits that URL, the client system redirects the user to a
       page served by the provider. The user authenticates with the provider.
       The provider handles authentication failure however it wants.
    3. On success, the provider POSTs to a URL endpoint on the consumer to
       invoke the pipeline. It sends back an arbitrary payload of data about
       the user.
    4. The pipeline begins, executing each function in its stack. The stack is
       defined on django's settings object's SOCIAL_AUTH_PIPELINE. This is done
       in settings._set_global_settings.
    5. Each pipeline function is variadic. Most pipeline functions are part of
       the pythons-social-auth library; our extensions are defined below. The
       pipeline is the same no matter what provider is used.
    6. Pipeline functions can return a dict to add arguments to the function
       invoked next. They can return None if this is not necessary.
    7. Pipeline functions may be decorated with @partial.partial. This pauses
       the pipeline and serializes its state onto the request's session. When
       this is done they may redirect to other edX handlers to execute edX
       account registration/sign in code.
    8. In that code, redirecting to get_complete_url() resumes the pipeline.
       This happens by hitting a handler exposed by the consumer system.
    9. In this way, execution moves between the provider, the pipeline, and
       arbitrary consumer system code.

Gotcha alert!:

Bear in mind that when pausing and resuming a pipeline function decorated with
@partial.partial, execution resumes by re-invoking the decorated function
instead of invoking the next function in the pipeline stack. For example, if
you have a pipeline of

    A
    B
    C

with an implementation of

    @partial.partial
    def B(*args, **kwargs):
        [...]

B will be invoked twice: once when initially proceeding through the pipeline
before it is paused, and once when other code finishes and the pipeline
resumes. Consequently, many decorated functions will first invoke a predicate
to determine if they are in their first or second execution (usually by
checking side-effects from the first run).

This is surprising but important behavior, since it allows a single function in
the pipeline to consolidate all the operations needed to establish invariants
rather than spreading them across two functions in the pipeline.

See http://psa.matiasaguirre.net/docs/pipeline.html for more docs.
"""

from customer.models import CustomerProfile
from .url_parms import add_url_params

def save_profile(backend, user, response, *args, **kwargs):

    url = None
    gender = CustomerProfile.OTHER
    if backend.name == 'facebook':
        url = "http://graph.facebook.com/%s/picture?type=large"%response['id']
    if backend.name == 'twitter':
        url = response.get('profile_image_url', '').replace('_normal','')
    if backend.name == 'google-oauth2':
        url = response['image'].get('url')
        ext = url.split('.')[-1]
        gimg_size = {'sz': "0"}
        url = add_url_params(url,gimg_size)
        gender = CustomerProfile.MALE if response.get('gender') == 'male' else CustomerProfile.FEMALE

    profile, created = CustomerProfile.objects.get_or_create(user=user, defaults={'avatar': url, 'gender': gender})

    if not created:
        if url and not profile.avatar:
            profile.avatar = url
        if gender and not profile.gender:
            profile.gender = gender
        profile.save()

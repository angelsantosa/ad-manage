/*
 * echarli
 *
 * Se definen los campos que son utilizados en la vista
 * la función gettext se encarga de obtener la caden ade traducción en el idioma
 * seleccionado.
 * 
 */
;(function (define, undefined) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'logger',
        'js/views/fields_custom',
        'js/mentor/models/mentor_model',
        'js/mentor/models/user_preferences_model',
        'js/mentor/views/mentor_settings_fields',
        'js/mentor/views/mentor_settings_view',
        'js/views/message_banner'
    ], function (gettext, $, _, Backbone, Logger, FieldViews, MentorModel, UserPreferencesModel,
                 MentorSettingsFieldViews, MentorSettingsView, MessageBannerView) {

        /*
         * En esta función se definen los parámetros recibidos en la creación del objeto MentorSettingsFactory desde la página de invocación
         */
        return function (fieldsData, authData, options, userAccountsApiUrl, userPreferencesApiUrl, accountUserId, platformName) {

            var mentorSettingsElement = $('.wrapper-mentor-settings');

            var mentorModel = new MentorModel();
            mentorModel.url = userAccountsApiUrl;

            var userPreferencesModel = new UserPreferencesModel();
            userPreferencesModel.url = userPreferencesApiUrl;

            var mentorDocumentUrl = options['user_accounts_mentor_document_api_url'];

            var messageView = new MessageBannerView({
                el: $('.message-banner')
            });

            /*
             * Se generan los datos que estarán disponibles en cada sección del formulario
             */

            var messagesData = {
                bannerHeader: gettext('Registration for this site is easy to fill in the boxes, you will have your new account created'),
                bannerContactData: gettext('Please provide contact details of a trusted person to whom we can contact in case of emergency'),
                bannerReadyPublish: gettext('Listo ya comienza a publicar tu primer curso'),
                bannerFooter: interpolate_text(
                    gettext('These data will only be shared when you have a confirmed booking with another user {platform_name} reservation'), {platform_name: platformName}
                )
            };

            var userIsAprentice = options['user_is_aprentice'];

            var sectionsData = [
                 {
                    step: 1,
                    stepName: 'ONE',
                    class: 'selected',
                    title: gettext('Complete your profile'),
                    groups: [
                        {
                            title: gettext('Mandatory'),
                            subtitle: gettext('Account details'),
                            fields: [
                                {
                                    el: '.mentor-username',
                                    view: new FieldViews.ReadonlyFieldView({
                                        model: mentorModel,
                                        title: gettext('Username'),
                                        valueAttribute: 'username',
                                        /*
                                        helpMessage: interpolate_text(
                                            gettext('The name that identifies you throughout {platform_name}. You cannot change your username.'), {platform_name: platformName}
                                        )*/
                                    })
                                },
                                {
                                    el: '.mentor-avatar',
                                    view: new MentorSettingsFieldViews.ProfileImageFieldView({
                                        model: mentorModel,
                                        valueAttribute: "profile_image",
                                        editable: true,
                                        messageView: messageView,
                                        imageMaxBytes: options['profile_image_max_bytes'],
                                        imageMinBytes: options['profile_image_min_bytes'],
                                        imageUploadUrl: options['profile_image_upload_url'],
                                        imageRemoveUrl: options['profile_image_remove_url']
                                    })
                                },
                                {
                                    el: '.mentor-fullname',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Full Name'),
                                        valueAttribute: 'name',
                                        iconClass: 'fa fa-user fa-lg',
                                        //helpMessage: gettext('The name that appears on your certificates. Other learners never see your full name.'),
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-email',
                                    view: new MentorSettingsFieldViews.EmailFieldView({
                                        model: mentorModel,
                                        title: gettext('Email Address'),
                                        valueAttribute: 'email',
                                        iconClass: 'fa fa-envelope-o fa-lg',
                                        /*
                                        helpMessage: interpolate_text(
                                            gettext('The email address you use to sign in. Communications from {platform_name} and your courses are sent to this address.'), {platform_name: platformName}
                                        ),*/
                                        persistChanges: true
                                    })
                                },
                                /*
                                {
                                    el: '.mentor-birthday',
                                    view: new FieldViews.DropdownFieldView({
                                        model: mentorModel,
                                        title: gettext('Year of Birth'),
                                        valueAttribute: 'year_of_birth',
                                        options: fieldsData['year_of_birth']['options'],
                                        persistChanges: true
                                    })
                                },
                                */
                                {
                                    el: '.mentor-date-of-birthday',
                                    view: new MentorSettingsFieldViews.DateOfBirthFieldView({
                                        model: mentorModel,
                                        title: gettext('Date of Birth'),
                                        valueAttribute: 'date_of_birth',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-password',
                                    view: new MentorSettingsFieldViews.PasswordFieldView({
                                        model: mentorModel,
                                        title: gettext('Password'),
                                        screenReaderTitle: gettext('Reset your Password'),
                                        valueAttribute: 'password',
                                        emailAttribute: 'email',
                                        /*linkTitle: gettext('Reset Password'),*/
                                        linkHref: fieldsData.password.url,
                                        //helpMessage: gettext('When you click "Reset Password", a message will be sent to your email address. Click the link in the message to reset your password.')
                                    })
                                },
                                {
                                    el: '.mentor-gender',
                                    view: new FieldViews.DropdownFieldView({
                                        model: mentorModel,
                                        title: gettext('Gender'),
                                        valueAttribute: 'gender',
                                        options: fieldsData.gender.options,
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-bio',
                                    view: new FieldViews.TextareaFieldView({
                                        model: mentorModel,
                                        showMessages: true,
                                        editable: 'always',
                                        title: gettext('About me') + " <i class='fa fa-pencil fa-lg'></i>",
                                        placeholderValue: gettext("Tell other learners a little about yourself: where you live, what your interests are, why you're taking courses, or what you hope to learn."),
                                        valueAttribute: "bio",
                                        //helpMessage: '',
                                        persistChanges: true,
                                        messagePosition: 'header'
                                    })
                                },
                                {
                                    el: '.mentor-country',
                                    view: new FieldViews.DropdownFieldView({
                                        model: mentorModel,
                                        required: true,
                                        title: gettext('Country or Region'),
                                        valueAttribute: 'country',
                                        options: fieldsData['country']['options'],
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-adress-1',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Address line 1'),
                                        valueAttribute: 'address_field_one',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-adress-2',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Address line 2'),
                                        valueAttribute: 'address_field_two',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-outdoor-number',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Outdoor number'),
                                        valueAttribute: 'outdoor_number',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-internal-number',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Internal number'),
                                        valueAttribute: 'internal_number',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-postal-code',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Postal Code'),
                                        valueAttribute: 'postal_code',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-state',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Province / Region / State / County'),
                                        valueAttribute: 'state_name',
                                        persistChanges: true
                                    })
                                },
                            ]
                        },
                    ]
                },
                {
                    step: 2,
                    stepName: 'TWO',
                    class: 'wait',
                    title: gettext('Verification and confidence'),
                    groups: [
                        {
                            title: gettext('Mandatory'),
                            subtitle: gettext('Proof of identity'),
                            fields: [
                                {
                                    el: '.mentor-receipt-id',
                                    view: new MentorSettingsFieldViews.FileUploadFieldView({
                                        model: mentorModel,
                                        valueAttribute: 'receipt_id',
                                        title: gettext("Official Identification"),
                                        subtitle: gettext("ID Card or Passport"),
                                        inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png file"),
                                        inputTip: gettext("Only properly filed documents will be accepted."),
                                        submitButtonText: gettext("Select file"),
                                        extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                        editable: true,
                                        messageView: messageView,
                                        documentMaxBytes: options['receipt_document_max_bytes'],
                                        documentMinBytes: options['receipt_document_min_bytes'],
                                        url: mentorDocumentUrl,
                                        hasReceiptDocumentProperty: 'has_receipt_id',
                                        getReceiptDocumentStatusProperty: 'get_receipt_id_status',
                                        receiptDocumentUrlProperty: 'document_url_receipt_id',
                                    })
                                },
                                {
                                    el: '.mentor-receipt-address',
                                    view: new MentorSettingsFieldViews.FileUploadFieldView({
                                        model: mentorModel,
                                        valueAttribute: 'receipt_address',
                                        title: gettext("Proof Address"),
                                        subtitle: gettext("Service receipts like Water, Light, Phone and/or Bank Account Status"),
                                        inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png file"),
                                        inputTip: gettext("Only properly filed documents will be accepted."),
                                        submitButtonText: gettext("Select file"),
                                        extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                        editable: true,
                                        messageView: messageView,
                                        documentMaxBytes: options['receipt_document_max_bytes'],
                                        documentMinBytes: options['receipt_document_min_bytes'],
                                        url: mentorDocumentUrl,
                                        hasReceiptDocumentProperty: 'has_receipt_address',
                                        getReceiptDocumentStatusProperty: 'get_receipt_address_status',
                                        receiptDocumentUrlProperty: 'document_url_receipt_address',
                                    })
                                },
                                {
                                    el: '.mentor-receipt-penal',
                                    view: new MentorSettingsFieldViews.FileUploadFieldView({
                                        model: mentorModel,
                                        valueAttribute: 'receipt_penal',
                                        title: gettext("No Criminal record Letter"),
                                        inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png file"),
                                        inputTip: gettext("Only properly filed documents will be accepted."),
                                        submitButtonText: gettext("Select file"),
                                        extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                        editable: true,
                                        messageView: messageView,
                                        documentMaxBytes: options['receipt_document_max_bytes'],
                                        documentMinBytes: options['receipt_document_min_bytes'],
                                        url: mentorDocumentUrl,
                                        hasReceiptDocumentProperty: 'has_receipt_penal',
                                        getReceiptDocumentStatusProperty: 'get_receipt_penal_status',
                                        receiptDocumentUrlProperty: 'document_url_receipt_penal',
                                    })
                                }
                            ]
                        },
                        {
                            title: gettext('Optional'),
                            subtitle: gettext('Knowledge (not required field)'),
                            fields: [
                                {
                                    el: '.mentor-receipt-knowledge',
                                    view: new MentorSettingsFieldViews.FileUploadFieldView({
                                        model: mentorModel,
                                        valueAttribute: 'receipt_knowledge',
                                        title: gettext("Certificate of Knowledge"),
                                        showStatus: "false",
                                        inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png file"),
                                        inputTip: gettext("Only properly filed documents will be accepted."),
                                        submitButtonText: gettext("Select file"),
                                        extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                        editable: true,
                                        messageView: messageView,
                                        documentMaxBytes: options['receipt_document_max_bytes'],
                                        documentMinBytes: options['receipt_document_min_bytes'],
                                        url: mentorDocumentUrl,
                                        hasReceiptDocumentProperty: 'has_receipt_knowledge',
                                        getReceiptDocumentStatusProperty: 'get_receipt_knowledge_status',
                                        receiptDocumentUrlProperty: 'document_url_receipt_knowledge',
                                    })
                                },
                                {
                                    el: '.mentor-receipt-diploma',
                                    view: new MentorSettingsFieldViews.FileUploadFieldView({
                                        model: mentorModel,
                                        valueAttribute: 'receipt_diploma',
                                        title: gettext("Diploma"),
                                        showStatus: "false",
                                        inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt file"),
                                        inputTip: gettext("Only properly filed documents will be accepted."),
                                        submitButtonText: gettext("Select file"),
                                        extensions: ".pdf, .doc, .docx, .odt",
                                        editable: true,
                                        messageView: messageView,
                                        documentMaxBytes: options['receipt_document_max_bytes'],
                                        documentMinBytes: options['receipt_document_min_bytes'],
                                        url: mentorDocumentUrl,
                                        hasReceiptDocumentProperty: 'has_receipt_diploma',
                                        getReceiptDocumentStatusProperty: 'get_receipt_diploma_status',
                                        receiptDocumentUrlProperty: 'document_url_receipt_diploma',
                                    })
                                }
                            ]
                        },
                        {
                            title: gettext('Mandatory'),
                            subtitle: gettext('Phone number'),
                            fields: [
                                {
                                    el: '.mentor-phone-country',
                                    view: new FieldViews.DropdownFieldView({
                                        model: mentorModel,
                                        required: true,
                                        title: gettext('Choose a country'),
                                        valueAttribute: 'country',
                                        options: fieldsData['country']['options'],
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-phone',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Add phone number'),
                                        valueAttribute: 'phone',
                                        //helpMessage: gettext('The institution of your last degree.'),
                                        persistChanges: true
                                    })
                                },
                            ]
                        }
                    ]
                },
                {
                    step: 3,
                    stepName: 'THREE',
                    class: 'wait',
                    title: gettext('Professionals and emergency'),
                    groups: [
                        {
                            title: gettext('Optional'),
                            subtitle: gettext('Professional details'),
                            fields: [
                                {
                                    el: '.mentor-occupation',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Occupation'),
                                        valueAttribute: 'occupation',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-educational-name',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Educational Name'),
                                        valueAttribute: 'educational_name',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-work-name',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Work Name'),
                                        valueAttribute: 'work_name',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-level-of-education',
                                    view: new FieldViews.DropdownFieldView({
                                        model: mentorModel,
                                        title: gettext('Education Completed'),
                                        valueAttribute: 'level_of_education',
                                        options: fieldsData.level_of_education.options,
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-language-proficiencies',
                                    view: new MentorSettingsFieldViews.LanguageProficienciesFieldView({
                                        model: mentorModel,
                                        title: gettext('Preferred Language'),
                                        valueAttribute: 'language_proficiencies',
                                        options: fieldsData.preferred_language.options,
                                        persistChanges: true
                                    })
                                }
                            ]
                        },
                        {
                            title: gettext('Mandatory'),
                            subtitle: gettext('Emergency data'),
                            fields: [
                                {
                                    el: '.mentor-emergency-contact-name',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Name'),
                                        valueAttribute: 'emergency_contact_name',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-emergency-contact-email',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Email'),
                                        valueAttribute: 'emergency_contact_email',
                                        iconClass: 'fa fa-envelope-o fa-lg',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-emergency-contact-relationship',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Relationship'),
                                        valueAttribute: 'emergency_contact_relationship',
                                        persistChanges: true
                                    })
                                },
                                {
                                    el: '.mentor-emergency-contact-phone',
                                    view: new FieldViews.TextFieldView({
                                        model: mentorModel,
                                        title: gettext('Phone number'),
                                        valueAttribute: 'emergency_contact_phone',
                                        persistChanges: true
                                    })
                                }
                            ]
                        }
                    ]
                },
                {
                    step: 4,
                    stepName: 'FOUR',
                    class: 'wait',
                    title: gettext('Your Social Networking'),
                    subtitle: gettext('Link your network'),
                    groups: [
                        {
                        }
                    ]
                },
                {
                    step: 5,
                    stepName: 'FIVE',
                    class: 'wait',
                    title: gettext('Publish'),
                    subtitle: gettext('Welcome'),
                    groups: [
                        {
                            image: '/static/images/holder/250x250.svg',
                            text: gettext('Publish your course'),
                            showAsTitle: true
                        },
                        {
                            image: '/static/images/holder/250x250.svg',
                            text: interpolate_text(
                                gettext('First steps in {platform_name}'), {platform_name: platformName}
                            )
                        },
                        {
                            image: '/static/images/holder/250x250.svg',
                            text: gettext('Mentor PREMIUM')
                        }
                    ]
                }
            ];

            if (_.isArray(authData.providers)) {
                var socialNetworkIcons = {
                    "oa2-facebook": 'fa fa-facebook-square fa-5x social-network-echarli',
                    "oa2-twitter": 'fa fa-twitter-square fa-5x social-network-echarli',
                    "oa2-linkedin-oauth2": 'fa fa-linkedin-square fa-5x social-network-echarli',
                    "oa2-google-oauth2": 'fa fa-google-plus-square fa-5x social-network-echarli'
                };
                var socialNetworkMessages = {
                    "oa2-facebook": gettext('When you publish your courses you can share'),
                    "oa2-twitter": gettext('Send news of your learning'),
                    "oa2-linkedin-oauth2": gettext('Take your course professionally and contact'),
                    "oa2-google-oauth2": gettext('Everyone has to be aware of your courses')
                };
                var accountsSectionData = {
                    fields: _.map(authData.providers, function(provider) {
                        return {
                            'view': new MentorSettingsFieldViews.AuthSocialNetworkFieldView({
                                title: provider.name,
                                screenReaderTitle: interpolate_text(
                                    gettext("Connect your {accountName} account"), {accountName: provider['name']}
                                ),
                                valueAttribute: 'auth-' + provider.id,
                                helpMessage: gettext(socialNetworkMessages[provider.id]),
                                icon: socialNetworkIcons[provider.id],
                                connected: provider.connected,
                                connectUrl: provider.connect_url,
                                acceptsLogins: provider.accepts_logins,
                                disconnectUrl: provider.disconnect_url
                            })
                        };
                    })
                };
                sectionsData[3].groups[0] = accountsSectionData;
            }

            var mentorSettingsView = new MentorSettingsView({
                model: mentorModel,
                accountUserId: accountUserId,
                userIsAprentice: userIsAprentice,
                el: mentorSettingsElement,
                sectionsData: sectionsData,
                messagesData: messagesData
            });

            mentorSettingsView.render();

            var showLoadingError = function () {
                mentorSettingsView.showLoadingError();
            };

            var showAccountFields = function () {
                // Record that the account settings page was viewed.
                Logger.log('edx.user.settings.viewed', {
                    page: "account",
                    visibility: null,
                    user_id: accountUserId
                });

                // Render the fields
                mentorSettingsView.renderFields();
            };

            mentorModel.fetch({
                success: function () {
                    // Fetch the user preferences model
                    userPreferencesModel.fetch({
                        success: showAccountFields,
                        error: showLoadingError
                    });
                },
                error: showLoadingError
            });

            return {
                mentorModel: mentorModel,
                userPreferencesModel: userPreferencesModel,
                mentorSettingsView: mentorSettingsView
            };
        };
    });
}).call(this, define || RequireJS.define);

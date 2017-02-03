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
        'js/publish/models/publish_model',
        'js/publish/models/user_preferences_model',
        'js/publish/views/publish_view',
        'js/publish/views/publish_fields',
        'js/views/message_banner'
    ], function (gettext, $, _, Backbone, Logger, FieldViews, PublishModel, UserPreferencesModel,
                 PublishView, PublishFieldViews, MessageBannerView) {

        /*
         * En esta función se definen los parámetros recibidos en la creación del objeto MentorSettingsFactory desde la página de invocación
         */
        return function (resourcesData, fieldsData, platformName, siteName, publishCourseApiUrl, accountUserId) {

            var publishElement = $('.wrapper-publish');

            var publishModel = new PublishModel();
            publishModel.url = publishCourseApiUrl;

           /* var mentorModel = new MentorModel();
            mentorModel.url = userAccountsApiUrl;

            var userPreferencesModel = new UserPreferencesModel();
            userPreferencesModel.url = userPreferencesApiUrl;

            var mentorDocumentUrl = userAccountsMentorDocumentApiUrl;
            */

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

            var sectionsData = [

                {
                    step: 1,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Basic data"),
                    fields: [
                        {
                            el: '.course-type',
                            view: new PublishFieldViews.RadioFieldView({
                                model: publishModel,
                                title: gettext('Course type'),
                                required: true,
                                valueAttribute: 'course_type',
                                options: fieldsData.course_type.options,
                                iconOptions: ['fa-user','fa-users','fa-desktop','fa-film'],
                                classOptions: ['course-type-individual', 'course-type-collective', 'course-type-remote', 'course-type-online'],
                                persistChanges: true
                            })
                        },
                        {
                            el: '.apprentices-num',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Minimum apprentices"),
                                valueAttribute: "minimum_apprentices",
                                className: 'col-md-5',
                                persistChanges: true,
                            })
                        },
                        {
                            el: '.apprentices-num',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Maximum apprentices"),
                                valueAttribute: "maximum_apprentices",
                                className: 'col-md-5',
                                persistChanges: true,
                            })
                        },
                        {
                            el: '.publish-assistants-slider',
                            view: new PublishFieldViews.SliderFieldView({
                                model: publishModel,
                                title: gettext("Program level"),
                                valueAttribute: "course_level",
                                options: fieldsData.course_level.options,
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.publish-assistants-schedule',
                            view: new PublishFieldViews.ScheduleFieldView({
                                model: publishModel,
                                title: gettext("Duration, Days and Schedule"),
                                valueAttribute: "schedule",
                                url: resourcesData['user_publish_course_schedule_api_url'],
                                options: fieldsData.days_of_week.options,
                                persistChanges: true
                            })
                        }
                    ]
                },

                {
                    step: 2,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Description"),
                    fields: [
                        {
                            el: '.container-views',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Name your course"),
                                placeholder: gettext("Write the title of the course"),
                                valueAttribute: "course_name",
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.container-views',
                            view: new PublishFieldViews.TextareaFieldView({
                                model: publishModel,
                                title: gettext("Course description"),
                                placeholder: gettext("Write a description of your course"),
                                valueAttribute: "course_description",
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.container-views-category',
                            view: new PublishFieldViews.DropdownGroupsFieldView({
                                model: publishModel,
                                title: gettext('Category'),
                                required: true,
                                valueAttribute: 'category',
                                options: fieldsData.categories.options,
                                persistChanges: true
                            })
                        },
                    ]
                },

                {
                    step: 3,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Location"),
                    fields: [
                        {
                            el: '.container-views-location-mode',
                            view: new PublishFieldViews.RadioFieldView({
                                model: publishModel,
                                title: gettext('Location mode'),
                                required: true,
                                valueAttribute: 'location_mode',
                                options: fieldsData.location_mode.options,
                                iconOptions: ['fa-map-marker',' fa-thumb-tack'],
                                classOptions: ['location-mode-apprentice', 'location-mode-mentor'],
                                persistChanges: true
                            })
                        },
                        {
                            el: '.container-views-location-type',
                            view: new PublishFieldViews.DropdownFieldView({
                                model: publishModel,
                                title: gettext('Location type'),
                                required: true,
                                valueAttribute: 'location_type',
                                options: fieldsData.location_type.options,
                                className: 'col-md-4',
                                persistChanges: true
                            })
                        },
                        {
                            el: '.container-views-location-country',
                            view: new PublishFieldViews.DropdownFieldView({
                                model: publishModel,
                                title: gettext('Country'),
                                required: true,
                                valueAttribute: 'location_country',
                                options: fieldsData.country.options,
                                className: 'col-md-4',
                                persistChanges: true
                            })
                        },
                        {
                            el: '.container-views-location-first',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Address"),
                                placeholder: gettext("Name of the street"),
                                valueAttribute: "location_address",
                                className: 'col-md-6',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.container-views-location-first',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("External number"),
                                placeholder: gettext("Number"),
                                valueAttribute: "location_outdoor_number",
                                className: 'col-md-3',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.container-views-location-first',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Internal number"),
                                placeholder: gettext("Number"),
                                valueAttribute: "location_internal_number",
                                className: 'col-md-3',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        /*
                        {
                            el: '.container-views-location-second',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Country"),
                                placeholder: gettext("Name of the country"),
                                valueAttribute: "location_country",
                                className: 'col-md-6',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        */
                        {
                            el: '.container-views-location-third',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("City"),
                                placeholder: gettext("Name of the city"),
                                valueAttribute: "location_city",
                                className: 'col-md-6',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.container-views-location-fourth',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("State"),
                                placeholder: gettext("Name of the state"),
                                valueAttribute: "location_state",
                                className: 'col-md-6',
                                persistChanges: true,
                                showHeader: true
                            })
                        },
                        {
                            el: '.container-views-location-fourth',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Postal code"),
                                placeholder: gettext("Postal code"),
                                valueAttribute: "location_postal_code",
                                className: 'col-md-5',
                                persistChanges: true,
                                showHeader: true
                            })
                        },
                    ]
                },

                {
                    step: 4,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Payment options"),
                    fields: [
                        {
                            el: '.container-views-paymentoptions',
                            view: new PublishFieldViews.RadioFieldView({
                                model: publishModel,
                                title: gettext('Payment type'),
                                required: true,
                                valueAttribute: 'payment_type',
                                options: fieldsData.payment_type.options,
                                iconOptions: ['fa-book','fa-paste', 'fa-smile-o'],
                                classOptions: ['payment-type-session', 'payment-type-program', 'payment-type-free'],
                                persistChanges: true
                            })
                        },
                        {
                            el: '.price-publish',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Price program"),
                                titleVisible: false,
                                placeholder: gettext("Enter the rate you want"),
                                valueAttribute: "price_program",
                                className: 'course-payment-program col-md-4',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.price-publish',
                            view: new PublishFieldViews.TextFieldView({
                                model: publishModel,
                                title: gettext("Price session"),
                                titleVisible: false,
                                placeholder: gettext("Enter the rate you want"),
                                valueAttribute: "price_session",
                                className: 'course-payment-session col-md-4',
                                persistChanges: true,
                                showHeader: true,
                            })
                        },
                        {
                            el: '.price-publish',
                            view: new PublishFieldViews.DropdownFieldView({
                                model: publishModel,
                                title: gettext('Currency'),
                                titleVisible: true,
                                required: true,
                                valueAttribute: 'price_currency',
                                options: fieldsData.price_currency.options,
                                className: 'course-payment-currency col-md-4',
                                persistChanges: true,
                                showHeader: true
                            })
                        },
                        {
                            el: '.container-views-paymentoptions-discount',
                            view: new PublishFieldViews.RadioFieldView({
                                model: publishModel,
                                title: gettext('Discount type'),
                                required: true,
                                valueAttribute: 'discount_type',
                                options: fieldsData.discount_type.options,
                                iconOptions: ['fa-gift','fa-bar-chart-o', 'fa-star', 'fa-times-circle'],
                                classOptions: ['discount-type-offer', 'discount-type-direct', 'discount-type-bulk', 'discount-type-no'],
                                persistChanges: true
                            })
                        },
                    ]

                },

                {
                    step: 5,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Pictures"),
                    fields: [
                        {
                            el: '.upload-resource-photo',
                            view: new PublishFieldViews.FileUploadFieldView({
                                model: publishModel,
                                valueAttribute: 'resource_photo',
                                title: gettext("Add Photo"),
                                subtitle: gettext("Remove me"),
                                inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt file"),
                                inputTip: gettext("Only properly filed documents will be accepted."),
                                submitButtonText: gettext("Select file"),
                                extensions: ".jpg, .jpeg, .png",
                                editable: true,
                                messageView: messageView,
                                documentMaxBytes: resourcesData['resource_document_max_bytes'],
                                documentMinBytes: resourcesData['resource_document_min_bytes'],
                                url: resourcesData['user_publish_course_resource_api_url'],
                                hasReceiptDocumentProperty: 'has_receipt_id',
                                getReceiptDocumentStatusProperty: 'get_receipt_id_status',
                                receiptDocumentUrlProperty: 'document_url_receipt_id',
                            })
                        }
                    ]
                },

                {
                    step: 6,
                    stepName: '',
                    class: 'wait',
                    title: gettext("Resources"),
                    fields: [
                        {
                            el: '.upload-resource-program',
                            view: new PublishFieldViews.FileUploadFieldView({
                                model: publishModel,
                                valueAttribute: 'resource_program',
                                title: gettext("Add Program"),
                                subtitle: gettext("Remove me"),
                                inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png, file"),
                                inputTip: gettext("Only properly filed documents will be accepted."),
                                submitButtonText: gettext("Select file"),
                                extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                editable: true,
                                messageView: messageView,
                                documentMaxBytes: resourcesData['resource_document_max_bytes'],
                                documentMinBytes: resourcesData['resource_document_min_bytes'],
                                url: resourcesData['user_publish_course_resource_api_url'],
                                hasReceiptDocumentProperty: 'has_receipt_id',
                                getReceiptDocumentStatusProperty: 'get_receipt_id_status',
                                receiptDocumentUrlProperty: 'document_url_receipt_id',
                            })
                        },
                        {
                            el: '.upload-resource-material',
                            view: new PublishFieldViews.FileUploadFieldView({
                                model: publishModel,
                                valueAttribute: 'resource_material',
                                title: gettext("Add Material"),
                                subtitle: gettext("Remove me"),
                                inputLabel: gettext("Choose any of .pdf, .doc, .docx, .odt, .jpg, .jpeg, .png file"),
                                inputTip: gettext("Only properly filed documents will be accepted."),
                                submitButtonText: gettext("Select file"),
                                extensions: ".pdf, .doc, .docx, .odt, .jpg, .jpeg, .png",
                                editable: true,
                                messageView: messageView,
                                documentMaxBytes: resourcesData['resource_document_max_bytes'],
                                documentMinBytes: resourcesData['resource_document_min_bytes'],
                                url: resourcesData['user_publish_course_resource_api_url'],
                                hasReceiptDocumentProperty: 'has_receipt_id',
                                getReceiptDocumentStatusProperty: 'get_receipt_id_status',
                                receiptDocumentUrlProperty: 'document_url_receipt_id',
                            })
                        },
                        {
                            el: '.upload-resource-program-list',
                            view: new PublishFieldViews.ReadonlyFieldView({
                                model: publishModel,
                                valueAttribute: "resources",
                                type: 1
                            })
                        },
                        {
                            el: '.upload-resource-material-list',
                            view: new PublishFieldViews.ReadonlyFieldView({
                                model: publishModel,
                                valueAttribute: "resources",
                                type: 2
                            })
                        },
                    ]
                },
            ];

            var gmapFieldView = new PublishFieldViews.GMapFieldView({
                    model: publishModel,
                    title: gettext('Google Map'),
                    screenReaderTitle: gettext('Google Map'),
                    helpMessage: '',
                    valueAttribute: "location_latitude",
                    useGeocode: false
            });

            var gridFieldView = new PublishFieldViews.GridFieldView({
                model: publishModel,
                valueAttribute: "resources"
            });

            var publishView = new PublishView({
                el: publishElement,
                sectionsData: sectionsData,
                messagesData: messagesData,
                gmapFieldView: gmapFieldView,
                gridFieldView: gridFieldView,
                url: publishCourseApiUrl
            });

            publishView.render();
            // publishView.renderFields();

            var showLoadingError = function () {
                accountSettingsView.showLoadingError();
            };

            var showAccountFields = function () {
                // Record that the account settings page was viewed.
                Logger.log('edx.user.publish.viewed', {
                    page: "publish",
                    visibility: null,
                    user_id: accountUserId
                });

                // Render the fields
                publishView.renderFields();
            };

            publishModel.fetch({
                success: showAccountFields,
                error: showLoadingError
            });

            return {
                /*mentorModel: mentorModel,
                userPreferencesModel: userPreferencesModel,
                */
                publishModel: publishModel,
                publishView: publishView
            };
        };
    });
}).call(this, define || RequireJS.define);

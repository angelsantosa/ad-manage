/*
 * echarli
 *
 * Se define el componente de la vista, utilizando la plantilla definida
 * por medio de text!
 *
 */
;(function (define, undefined) {
    'use strict';
    define([
        'gettext',
        'jquery',
        'underscore',
        'backbone',
        'holder',
        'js/publish/form-wizard',
        'text!templates/publish/course.underscore',
        'text!templates/publish/course_step_basicdata.underscore',
        'text!templates/publish/course_step_description.underscore',
        'text!templates/publish/course_step_location.underscore',
        'text!templates/publish/course_step_paymentoptions.underscore',
        'text!templates/publish/course_step_pictures.underscore',
        'text!templates/publish/course_step_resources.underscore',
        // Plugins que no proporcionan objetos en la función, se unen a jquery
        'daterangepicker'
    ], function (gettext, $, _, Backbone, Holder, FormWizard, publishTemplate,
                 publishTemplateBasicData, publishTemplateDescription, publishTemplateLocation,
                 publishTemplatePaymentOptions,
                 publishTemplatePictures, publishTemplateResource) {

        var PublishView = Backbone.View.extend({

            events: {
                'click .course-type-individual': 'selectorCourseTypeIndividual',
                'click .course-type-collective': 'selectorCourseTypeCollective',
                'click .course-type-remote': 'selectorCourseRemote',
                'click .course-type-online': 'selectorCourseTypeOnline',
                'click .location-mode-apprentice': 'selectorCourseLocationModeApprentice',
                'click .location-mode-mentor': 'selectorCourseLocationModeMentor',
                'click .payment-type-session': 'selectorCoursePaymentSession',
                'click .payment-type-program': 'selectorCoursePaymentProgram',
                'click .payment-type-free': 'selectorCoursePaymentFree',
                'click .publish-course': 'createPublishCourse',
            },

            initialize: function () {
                _.bindAll(this, 'render', 'afterRender', 'renderFields', 'showLoadingError', 'createPublishCourse');
                /*
                 * Invocar funciones before y after al hacer el renderFields de la página
                 */
                this.renderFields = _.wrap(this.renderFields, function(renderFields) {
                  renderFields.apply(this);
                  this.afterRender();

                  /* Ocultar elementos en la inicializacion */
                  if(this.$('.course-type-online').hasClass('success')){
                    this.$('.apprentices-num').addClass('hidden');
                  }

                  if(this.$('.location-mode-apprentice').hasClass('success')){
                    this.$('.location-options-mentor').addClass('hidden');
                  }

                  if(this.$('.payment-type-session').hasClass('success')){
                    this.$('.course-payment-program').addClass('hidden');
                    this.$('.course-payment-session').removeClass('hidden');
                    this.$('.course-payment-currency').removeClass('hidden');
                  }

                  if(this.$('.payment-type-program').hasClass('success')){
                    this.$('.course-payment-session').addClass('hidden');
                    this.$('.course-payment-program').removeClass('hidden');
                    this.$('.course-payment-currency').removeClass('hidden');
                  }

                  if(this.$('.payment-type-free').hasClass('success')){
                    this.$('.course-payment-session').addClass('hidden');
                    this.$('.course-payment-program').addClass('hidden');
                    this.$('.course-payment-currency').addClass('hidden');
                  }
                
                  return this;
                });
            },

            render: function () {
                this.$el.html(_.template(publishTemplate, {
                    sections: this.options.sectionsData,
                    platformName: this.options.platformName,
                    userIsAprentice: this.options.userIsAprentice,
                    messagesData: this.options.messagesData
                }));
                return this;
            },

            afterRender: function() {
                var wizard = this.el;
                FormWizard.initialize(wizard);
            },

            renderFields: function () {
                this.$('.ui-loading-indicator').addClass('is-hidden');

                var view = this;

                // Step One
                this.$('#step-1').append(_.template(publishTemplateBasicData));
                this.$('#step-2').append(_.template(publishTemplateDescription));
                this.$('#step-3').append(_.template(publishTemplateLocation));
                this.$('#step-4').append(_.template(publishTemplatePaymentOptions));
                this.$('#step-5').append(_.template(publishTemplatePictures));
                this.$('#step-6').append(_.template(publishTemplateResource));

                this.$('.publish-map').append(this.options.gmapFieldView.render().el);
                this.$('.gallery-container').append(this.options.gridFieldView.render().el);

                // All Steps Content Data
                /*
                _.each(view.options.sectionsData, function (section, index) {
                    _.each(section.groups, function (group, index) {
                        _.each(group.fields, function (field) {
                            view.$(field.el).append(field.view.render().el);
                        });
                    });
                });
                */
                _.each(view.options.sectionsData, function (section, index) {
                    _.each(section.fields, function (field) {
                        view.$(field.el).append(field.view.render().el);
                    });
                });

                return this;
            },
            showLoadingError: function () {
                this.$('.ui-loading-indicator').addClass('is-hidden');
                this.$('.ui-loading-error').removeClass('is-hidden');
            },

            selectorCourseTypeIndividual: function () {
                this.$('.apprentices-num').removeClass('hidden');
            },

            selectorCourseTypeCollective: function () {
                this.$('.apprentices-num').removeClass('hidden');
            },

            selectorCourseTypeRemote: function () {
                this.$('.apprentices-num').removeClass('hidden');
            },

            selectorCourseTypeOnline: function () {
                this.$('.apprentices-num').addClass('hidden');
            },

            selectorCourseLocationModeApprentice: function () {
                this.$('.location-options-mentor').addClass('hidden');
            },

            selectorCourseLocationModeMentor: function () {
                this.$('.location-options-mentor').removeClass('hidden');
            },

            selectorCoursePaymentSession: function () {
                this.$('.course-payment-program').addClass('hidden');
                this.$('.course-payment-session').removeClass('hidden');
                this.$('.course-payment-currency').removeClass('hidden');
            },

            selectorCoursePaymentProgram: function () {
                this.$('.course-payment-session').addClass('hidden');
                this.$('.course-payment-program').removeClass('hidden');
                this.$('.course-payment-currency').removeClass('hidden');
            },

            selectorCoursePaymentFree: function () {
                this.$('.course-payment-session').addClass('hidden');
                this.$('.course-payment-program').addClass('hidden');
                this.$('.course-payment-currency').addClass('hidden');
            },

            createPublishCourse: function () {
                var view = this;
                console.log("Crear curso");
                console.log(view.options.url);

                $.ajax({
                    type: 'POST',
                    url: view.options.url
                }).done(function (data) {
                    console.log("redirect to");
                    console.log(data.course_key);
                    window.location.href = "/courses/" + data.course_key + "/about";
                    // view.scheduleChangeSucceeded();
                }).fail(function (jqXHR) {
                    console.log("show error");
                    console.log(jqXHR.status);
                    console.log(jqXHR.responseText);
                    // view.showScheduleChangeFailedMessage(jqXHR.status, jqXHR.responseText);
                });
            }
        });
    
    return PublishView;

        
    });
}).call(this, define || RequireJS.define);

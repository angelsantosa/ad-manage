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
        'js/mentor/form-wizard',
        'text!templates/mentor/mentor_settings.underscore',
        'text!templates/mentor/mentor_settings_step_one.underscore',
        'text!templates/mentor/mentor_settings_step_two.underscore',
        'text!templates/mentor/mentor_settings_step_three.underscore',
        'text!templates/mentor/mentor_settings_step_four.underscore',
        'text!templates/mentor/mentor_settings_step_five.underscore'
    ], function (gettext, $, _, Backbone, Holder, FormWizard, mentorSettingsTemplate,
                 mentorSettingsTemplateStepOne, mentorSettingsTemplateStepTwo, mentorSettingsTemplateStepThree,
                 mentorSettingsTemplateStepFour, mentorSettingsTemplateStepFive) {

        var MentorSettingsView = Backbone.View.extend({

            events: {
                'click .become-mentor-button': 'becomeMentorClicked'
            },

            initialize: function () {
                _.bindAll(this, 'render', 'afterRender', 'renderFields', 'showLoadingError', 'becomeMentorClicked');
                /*
                 * Invocar funciones before y after al hacer el renderFields de la página
                 */
                this.renderFields = _.wrap(this.renderFields, function(renderFields) {
                  renderFields.apply(this);
                  this.afterRender();
                });
            },

            render: function () {
                this.$el.html(_.template(mentorSettingsTemplate, {
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
                var step1, step2, step3, step4, field, fields;

                // Step One
                this.$('#step-1').append(_.template(mentorSettingsTemplateStepOne, {
                    title: this.options.sectionsData[0].groups[0].title,
                    subtitle: this.options.sectionsData[0].groups[0].subtitle,
                    messagesData: this.options.messagesData
                }));

                // Step Two
                this.$('#step-2').append(_.template(mentorSettingsTemplateStepTwo, {
                    title_group_one: this.options.sectionsData[1].groups[0].title,
                    subtitle_group_one: this.options.sectionsData[1].groups[0].subtitle,
                    title_group_two: this.options.sectionsData[1].groups[1].title,
                    subtitle_group_two: this.options.sectionsData[1].groups[1].subtitle,
                    title_group_three: this.options.sectionsData[1].groups[2].title,
                    subtitle_group_three: this.options.sectionsData[1].groups[2].subtitle,
                    messagesData: this.options.messagesData
                }));

                // Step Three
                this.$('#step-3').append(_.template(mentorSettingsTemplateStepThree, {
                    title_group_one: this.options.sectionsData[2].groups[0].title,
                    subtitle_group_one: this.options.sectionsData[2].groups[0].subtitle,
                    title_group_two: this.options.sectionsData[2].groups[1].title,
                    subtitle_group_two: this.options.sectionsData[2].groups[1].subtitle,
                    messagesData: this.options.messagesData
                }));

                // Step Four
                this.$('#step-4').append(_.template(mentorSettingsTemplateStepFour, {
                    subtitle: this.options.sectionsData[3].subtitle,
                    messagesData: this.options.messagesData
                }));

                // Step Four
                step4 = this.$('.mentor-social-networks');
                fields = view.options.sectionsData[3].groups[0].fields;
                _.each(fields, function (field) {
                    $(step4).append(field.view.render().el);
                });

                // Step Five
                this.$('#step-5').append(_.template(mentorSettingsTemplateStepFive, {
                    subtitle: this.options.sectionsData[4].subtitle,
                    groups: this.options.sectionsData[4].groups,
                    messagesData: this.options.messagesData
                }));

                // All Steps Content Data
                _.each(view.options.sectionsData, function (section, index) {
                    _.each(section.groups, function (group, index) {
                        _.each(group.fields, function (field) {
                            view.$(field.el).append(field.view.render().el);
                        });
                    });
                });

                return this;
            },

            becomeMentorClicked: function () {
                var _view = this;

                // Hacer cambio en el modelo de datos y actualizar a Candidato
                var attributes = {};
                attributes['user_profile_status'] = 'C';
                var defaultOptions = {
                    contentType: 'application/merge-patch+json',
                    patch: true,
                    wait: true,
                    success: function () {
                        // Recarga la página al aceptar convertirse en Mentor
                        location.reload();
                    },
                    error: function (model, xhr) {
                        //view.showErrorMessage(xhr);
                        console.log(xhr);
                    }
                };
                // this.showInProgressMessage();
                this.model.save(attributes, _.extend(defaultOptions, attributes));
            },

            showLoadingError: function () {
                this.$('.ui-loading-indicator').addClass('is-hidden');
                this.$('.ui-loading-error').removeClass('is-hidden');
            }
        });

        return MentorSettingsView;
    });
}).call(this, define || RequireJS.define);

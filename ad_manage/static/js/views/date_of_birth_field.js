;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields_custom',
        'text!templates/fields_custom/field_date_of_birth.underscore',
        'backbone-super', 'birthdayPicker'
    ], function (gettext, $, _, Backbone, FieldViews, field_date_of_birth_template) {

        var DateOfBirthFieldView = FieldViews.FieldView.extend({

            fieldType: 'date',

            fieldTemplate: field_date_of_birth_template,
            uploadButtonSelector: '.upload-button-input',

            titleAdd: gettext("Upload an image"),
            titleEdit: gettext("Change image"),
            titleRemove: gettext("Remove"),

            titleUploading: gettext("Uploading"),
            titleRemoving: gettext("Removing"),

            titleImageAlt: '',
            screenReaderTitle: gettext("Image"),

            iconUpload: '<i class="icon fa fa-camera" aria-hidden="true"></i>',
            iconRemove: '<i class="icon fa fa-remove" aria-hidden="true"></i>',
            iconProgress: '<i class="icon fa fa-spinner fa-pulse fa-spin" aria-hidden="true"></i>',

            errorMessage: gettext("An error has occurred. Refresh the page, and then try again."),

            events: {
                /*
                'click .u-field-upload-button': 'clickedUploadButton',
                'click .u-field-remove-button': 'clickedRemoveButton',
                'click .upload-submit': 'clickedUploadButton',
                'focus .upload-button-input': 'showHoverState',
                'blur .upload-button-input': 'hideHoverState'
                */
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'afterRender', 'checkForSave');
                /*
                 * Invocar funciones before y after al hacer el render de la página
                 */
                this.render = _.wrap(this.render, function(render) {
                  render.apply(this);
                  this.afterRender();
                  return this;
                });
            },

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    message: this.helpMessage
                }));
                this.delegateEvents();
                return this;
            },

            afterRender: function() {
                var dob = this.$(".u-field-custom-dob");
                dob.birthdayPicker({
                    defaultDate: undefined,
                    maxAge: 100,
                    minAge : 18,
                    callback: this.checkForSave
                });
            },

            checkForSave: function (value) {
                console.log(value);
            },

            showHoverState: function () {
                this.$('.u-field-upload-button').addClass('button-visible');
            },

            hideHoverState: function () {
                this.$('.u-field-upload-button').removeClass('button-visible');
            },

            showErrorMessage: function (message) {
                return message;
            },

            imageUrl: function () {
                return '';
            },

            uploadButtonTitle: function () {
                if (this.isShowingPlaceholder()) {
                    return _.result(this, 'titleAdd');
                } else {
                    return _.result(this, 'titleEdit');
                }
            },

            removeButtonTitle: function () {
                return this.titleRemove;
            },

            isEditingAllowed: function () {
                return true;
            },

            isShowingPlaceholder: function () {
                return false;
            },

            setUploadButtonVisibility: function (state) {
                this.$('.u-field-upload-button').css('display', state);
            },

            setRemoveButtonVisibility: function (state) {
                this.$('.u-field-remove-button').css('display', state);
            },

            updateButtonsVisibility: function () {
                if (!this.isEditingAllowed() || !this.options.editable) {
                    this.setUploadButtonVisibility('none');
                }

                if (this.isShowingPlaceholder() || !this.options.editable) {
                    this.setRemoveButtonVisibility('none');
                }
            },

            clickedUploadButton: function () {
                $(this.uploadButtonSelector).fileupload({
                    url: this.options.imageUploadUrl,
                    type: 'POST',
                    add: this.fileSelected,
                    done: this.imageChangeSucceeded,
                    fail: this.imageChangeFailed
                });
            },

            clickedRemoveButton: function () {
                var view = this;
                this.setCurrentStatus('removing');
                this.setUploadButtonVisibility('none');
                this.showRemovalInProgressMessage();
                $.ajax({
                    type: 'POST',
                    url: this.options.imageRemoveUrl
                }).done(function () {
                    view.imageChangeSucceeded();
                }).fail(function (jqXHR) {
                    view.showImageChangeFailedMessage(jqXHR.status, jqXHR.responseText);
                });
            },

        });

        return DateOfBirthFieldView;
    });
}).call(this, define || RequireJS.define);

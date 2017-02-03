/**
 * A view for uploading a file.
 *
 * Currently only single-file upload is supported (to support multiple-file uploads, the HTML
 * input must be changed to specify "multiple" and the notification messaging needs to be changed
 * to support the display of multiple status messages).
 *
 * There is no associated model, but the view supports the following options:
 *
 * @param title, the title to display.
 * @param inputLabel, a label that will be added for the file input field. Note that this label is only shown to
 *     screen readers.
 * @param inputTip, a tooltip linked to the file input field. Can be used to state what sort of file can be uploaded.
 * @param extensions, the allowed file extensions of the uploaded file, as a comma-separated string (ex, ".csv,.txt").
 *     Some browsers will enforce that only files with these extensions can be uploaded, but others
 *     (for instance, Firefox), will not. By default, no extensions are specified and any file can be uploaded.
 * @param submitButtonText, text to display on the submit button to upload the file. The default value for this is
 *     "Upload File".
 * @param url, the url for posting the uploaded file.
 */
;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone',
        'js/views/fields',
        'text!templates/fields_custom/field_file_upload.underscore',
        'backbone-super', 'jquery.fileupload',
        'bootstrap', 'bootstrap-modal', 'bootstrap-modalmanager'
    ], function (gettext, $, _, Backbone, FieldViews, field_file_upload_template) {

        var FileUploaderView = FieldViews.FieldView.extend({

            fieldType: 'file',

            fieldTemplate: field_file_upload_template,
            uploadButtonSelector: '.upload-button-input',

            titleAdd: gettext("Select file"),
            titleEdit: gettext("Change file"),
            titleRemove: gettext("Remove"),

            titleUploading: gettext("Uploading"),
            titleRemoving: gettext("Removing"),

            screenReaderTitle: gettext("Document"),

            iconUpload: 'fa-folder-open-o',
            iconUploaded: 'fa-folder-o',
            iconRemove: 'fa-remove',
            iconProgress: 'fa-spinner fa-pulse fa-spins',

            errorMessage: gettext("An error has occurred. Refresh the page, and then try again."),

            documentMaxBytes: 1024 * 1024,
            documentMBytes: 100,

            events: {
                'click .u-field-upload-button': 'clickedUploadButton',
                'click .u-field-remove-button': 'clickedRemoveButton',
                //'click .upload-submit': 'clickedUploadButton',
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'documentChangeSucceeded', 'documentChangeFailed', 'fileSelected',
                          'watchForPageUnload', 'onBeforeUnload');
            },

            render: function () {
                var options = this.options,
                    get_option_with_default = function(option, default_value) {
                        var optionVal = options[option];
                        return optionVal ? optionVal : default_value;
                    };

                this.$el.html(this.template({
                    id: get_option_with_default("valueAttribute", ""),
                    title: get_option_with_default("title", ""),
                    subtitle: get_option_with_default("subtitle", ""),
                    uploadButtonIcon: _.result(this, 'uploadButtonIcon'),
                    uploadButtonTitle: _.result(this, 'uploadButtonTitle'),
                    removeButtonIcon: _.result(this, 'iconRemove'),
                    removeButtonTitle: _.result(this, 'removeButtonTitle'),
                    screenReaderTitle: _.result(this, 'screenReaderTitle'),
                    inputLabel: get_option_with_default("inputLabel", ""),
                    inputTip: get_option_with_default("inputTip", ""),
                    showStatus: get_option_with_default("showStatus", "true"),
                    documentUrl: _.result(this, 'documentUrl'),
                    documentStatus: _.result(this, 'documentStatus'),
                    iconDocumentStatus: _.result(this, 'documentIconStatus'),
                    helpMessageDocumentStatus: _.result(this, 'documentHelpMessageStatus'),
                    isShowingPlaceholder: _.result(this, 'isShowingPlaceholder'),
                    extensions: get_option_with_default("extensions", ""),
                    submitButtonText: get_option_with_default("submitButtonText", gettext("Upload File"))
                }));

                this.delegateEvents();
                this.updateButtonsVisibility();
                this.watchForPageUnload();

                return this;
            },

            showErrorMessage: function (message) {
                return message;
            },

            uploadButtonIcon: function () {
                //if (this.isShowingPlaceholder()) {
                //    return _.result(this, 'iconUpload');
                //} else {
                    return _.result(this, 'iconUploaded');
                //}
            },

            uploadButtonTitle: function () {
                if (this.isShowingPlaceholder()) {
                    return _.result(this, 'titleAdd');
                } else {
                    return _.result(this, 'titleEdit');
                }
            },

            documentUrl: function () {
                return '';
            },

            documentStatus: function () {
                return gettext("File Missing");
            },

            documentIconStatus: function () {
                return "fa-file-o";
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
                    url: this.options.url,
                    type: 'POST',
                    autoUpload: false,
                    replaceFileInput: false,
                    add: this.fileSelected,
                    done: this.documentChangeSucceeded,
                    fail: this.documentChangeFailed
                });
            },

            clickedRemoveButton: function () {
                var view = this;
                this.setCurrentStatus('removing');
                this.setUploadButtonVisibility('none');
                this.showRemovalInProgressMessage();
                $.ajax({
                    type: 'DELETE',
                    url: this.options.url + '/' + this.options.valueAttribute,
                }).done(function () {
                    view.documentChangeSucceeded();
                }).fail(function (jqXHR) {
                    view.showDocumentChangeFailedMessage(jqXHR.status, jqXHR.responseText);
                });
            },

            documentChangeSucceeded: function () {
                this.render();
            },

            documentChangeFailed: function (e, data) {
            },

            showDocumentChangeFailedMessage: function (status, responseText) {
            },

            fileSelected: function (e, data) {
                if (_.isUndefined(data.files[0].size) || this.validateDocumentSize(data.files[0].size)) {
                    this.setCurrentStatus('uploading');
                    this.setRemoveButtonVisibility('none');
                    this.showUploadInProgressMessage();
                    e.preventDefault();
                    data.submit();
                }
            },

            validateDocumentSize: function (imageBytes) {
                var humanReadableSize;
                if (imageBytes < this.options.documentMinBytes) {
                    humanReadableSize = this.bytesToHumanReadable(this.options.documentMinBytes);
                    this.showErrorMessage(
                        interpolate_text(
                            gettext("The file must be at least {size} in size."), {size: humanReadableSize}
                        )
                    );
                    return false;
                } else if (imageBytes > this.options.documentMaxBytes) {
                    humanReadableSize = this.bytesToHumanReadable(this.options.documentMaxBytes);
                    this.showErrorMessage(
                        interpolate_text(
                            gettext("The file must be smaller than {size} in size."), {size: humanReadableSize}
                        )
                    );
                    return false;
                }
                return true;
            },

            showUploadInProgressMessage: function () {
                this.$('.u-field-upload-button').css('opacity', 1);
                this.$('.upload-button-icon').removeClass(this.uploadButtonIcon);
                this.$('.upload-button-icon').addClass(this.iconProgress);
                this.$('.upload-button-title').html(this.titleUploading);
            },

            showRemovalInProgressMessage: function () {
                this.$('.u-field-remove-button').css('opacity', 1);
                this.$('.remove-button-icon').removeClass(this.uploadButtonIcon);
                this.$('.remove-button-icon').addClass(this.iconProgress);
                this.$('.remove-button-title').html(this.titleRemoving);
            },

            setCurrentStatus: function (status) {
                this.$('.document-wrapper').attr('data-status', status);
            },

            getCurrentStatus: function () {
                return this.$('.document-wrapper').attr('data-status');
            },

            watchForPageUnload: function () {
                $(window).on('beforeunload', this.onBeforeUnload);
            },

            onBeforeUnload: function () {
                var status = this.getCurrentStatus();
                if (status === 'uploading') {
                    return gettext("Upload is in progress. To avoid errors, stay on this page until the process is complete.");
                } else if (status === 'removing') {
                    return gettext("Removal is in progress. To avoid errors, stay on this page until the process is complete.");
                }
            },

            bytesToHumanReadable: function (size) {
                var units = [gettext('bytes'), gettext('KB'), gettext('MB')];
                var i = 0;
                while(size >= 1024) {
                    size /= 1024;
                    ++i;
                }
                return size.toFixed(1)*1 + ' ' + units[i];
            }

        });

        return FileUploaderView;
    });
}).call(this, define || RequireJS.define);
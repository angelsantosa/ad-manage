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
        'gettext', 'jquery', 'underscore', 'backbone',
        'js/views/fields_custom', 'js/views/file_uploader_field', 'js/views/image_field', 'js/views/date_of_birth_field'
    ], function (gettext, $, _, Backbone, FieldViews, FileUploaderView, ImageFieldView, DateOfBirthFieldView) {

        var MentorSettingsFieldViews = {};

        MentorSettingsFieldViews.EmailFieldView = FieldViews.TextFieldView.extend({

            imageUrl: function () {
                return this.model.profileImageUrl();
            },

            successMessage: function() {
                return this.indicators.success + interpolate_text(
                    gettext(
                        /* jshint maxlen: false */
                        'We\'ve sent a confirmation message to {new_email_address}. Click the link in the message to update your email address.'
                    ),
                    {'new_email_address': this.fieldValue()}
                );
            }
        });

        MentorSettingsFieldViews.LanguagePreferenceFieldView = FieldViews.DropdownFieldView.extend({

            saveSucceeded: function () {
                var data = {
                    'language': this.modelValue()
                };

                var view = this;
                $.ajax({
                    type: 'POST',
                    url: '/i18n/setlang/',
                    data: data,
                    dataType: 'html',
                    success: function () {
                        view.showSuccessMessage();
                    },
                    error: function () {
                        view.showNotificationMessage(
                            view.indicators.error +
                                gettext('You must sign out and sign back in before your language changes take effect.')
                        );
                    }
                });
            }

        });

        MentorSettingsFieldViews.PasswordFieldView = FieldViews.LinkFieldView.extend({

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'resetPassword');
            },

            linkClicked: function (event) {
                event.preventDefault();
                this.resetPassword(event);
            },

            resetPassword: function () {
                var data = {};
                data[this.options.emailAttribute] = this.model.get(this.options.emailAttribute);

                var view = this;
                $.ajax({
                    type: 'POST',
                    url: view.options.linkHref,
                    data: data,
                    success: function () {
                        view.showSuccessMessage();
                    },
                    error: function (xhr) {
                        view.showErrorMessage(xhr);
                    }
                });
            },

            successMessage: function () {
                return this.indicators.success + interpolate_text(
                    gettext(
                        /* jshint maxlen: false */
                        'We\'ve sent a message to {email_address}. Click the link in the message to reset your password.'
                    ),
                    {'email_address': this.model.get(this.options.emailAttribute)}
                );
            }
        });

        MentorSettingsFieldViews.LanguageProficienciesFieldView = FieldViews.DropdownFieldView.extend({

            modelValue: function () {
                var modelValue = this.model.get(this.options.valueAttribute);
                if (_.isArray(modelValue) && modelValue.length > 0) {
                    return modelValue[0].code;
                } else {
                    return null;
                }
            },

            saveValue: function () {
                if (this.persistChanges === true) {
                    var attributes = {},
                        value = this.fieldValue() ? [{'code': this.fieldValue()}] : [];
                    attributes[this.options.valueAttribute] = value;
                    this.saveAttributes(attributes);
                }
            }
        });

        MentorSettingsFieldViews.AuthFieldView = FieldViews.LinkFieldView.extend({

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'redirect_to', 'disconnect', 'successMessage', 'inProgressMessage');
            },

            render: function () {
                var linkTitle;
                if (this.options.connected) {
                    linkTitle = gettext('Unlink');
                } else if (this.options.acceptsLogins) {
                    linkTitle = gettext('Link')
                } else {
                    linkTitle = ''
                }

                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    icon: this.options.icon,
                    screenReaderTitle: this.options.screenReaderTitle,
                    linkTitle: linkTitle,
                    linkHref: '',
                    message: this.helpMessage,
                }));
                return this;
            },

            linkClicked: function (event) {
                event.preventDefault();

                this.showInProgressMessage();

                if (this.options.connected) {
                    this.disconnect();
                } else {
                    // Direct the user to the providers site to start the authentication process.
                    // See python-social-auth docs for more information.
                    this.redirect_to(this.options.connectUrl);
                }
            },

            redirect_to: function (url) {
                window.location.href = url;
            },

            disconnect: function () {
                var data = {};

                // Disconnects the provider from the user's edX account.
                // See python-social-auth docs for more information.
                var view = this;
                $.ajax({
                    type: 'POST',
                    url: this.options.disconnectUrl,
                    data: data,
                    dataType: 'html',
                    success: function () {
                        view.options.connected = false;
                        view.render();
                        view.showSuccessMessage();
                    },
                    error: function (xhr) {
                        view.showErrorMessage(xhr);
                    }
                });
            },

            inProgressMessage: function() {
                return this.indicators.inProgress + (this.options.connected ? gettext('Unlinking') : gettext('Linking'));
            },

            successMessage: function() {
                return this.indicators.success + gettext('Successfully unlinked.');
            }
        });

        MentorSettingsFieldViews.AuthSocialNetworkFieldView = FieldViews.LinkSocialNetworkFieldView.extend({

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'redirect_to', 'disconnect', 'successMessage', 'inProgressMessage');
            },

            render: function () {
                var linkTitle, linkIcon;
                if (this.options.connected) {
                    linkTitle = gettext('Unlink');
                    linkIcon = 'fa-clipboard';
                } else if (this.options.acceptsLogins) {
                    linkTitle = gettext('Link')
                    linkIcon = 'fa-file-o';
                } else {
                    linkTitle = ''
                    linkIcon = '';
                }

                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    icon: this.options.icon,
                    screenReaderTitle: this.options.screenReaderTitle,
                    linkTitle: linkTitle,
                    linkIcon: linkIcon,
                    linkHref: '',
                    message: this.helpMessage,
                }));
                return this;
            },

            linkClicked: function (event) {
                event.preventDefault();

                this.showInProgressMessage();

                if (this.options.connected) {
                    this.disconnect();
                } else {
                    // Direct the user to the providers site to start the authentication process.
                    // See python-social-auth docs for more information.
                    this.redirect_to(this.options.connectUrl);
                }
            },

            redirect_to: function (url) {
                window.location.href = url;
            },

            disconnect: function () {
                var data = {};

                // Disconnects the provider from the user's edX account.
                // See python-social-auth docs for more information.
                var view = this;
                $.ajax({
                    type: 'POST',
                    url: this.options.disconnectUrl,
                    data: data,
                    dataType: 'html',
                    success: function () {
                        view.options.connected = false;
                        view.render();
                        view.showSuccessMessage();
                    },
                    error: function (xhr) {
                        view.showErrorMessage(xhr);
                    }
                });
            },

            inProgressMessage: function() {
                return this.indicators.inProgress + (this.options.connected ? gettext('Unlinking') : gettext('Linking'));
            },

            successMessage: function() {
                return this.indicators.success + gettext('Successfully unlinked.');
            }
        });

        MentorSettingsFieldViews.FileUploadFieldView = FileUploaderView.extend({

            screenReaderTitle: gettext('Mentor Document'),

            documentUrl: function() {
                var property = this.options.receiptDocumentUrlProperty;
                return this.model.receiptDocumentUrlProperty(property);
            },

            documentStatus: function () {
                var property = this.options.getReceiptDocumentStatusProperty;
                var message = this.model.getReceiptDocumentStatusProperty(property);
                return gettext(message);
            },

            documentIconStatus: function () {
                if (typeof this.options.showStatus == "undefined" || this.options.showStatus == "true") {
                    var property = this.options.getReceiptDocumentStatusProperty;
                    var status = this.model.getReceiptDocumentStatusProperty(property);
                    var icons = {
                        "Approved": "fa-clipboard",
                        "File Missing": "fa-file-o",
                        "Approvingly": "fa-search",
                        "Reload": "fa-unknow",
                        "Suggested": "fa-unknow",
                        "Loadded": "fa-unknow"
                    };
                    return icons[status];
                }
                return "fa-smile";
            },

            documentHelpMessageStatus: function () {
                if (typeof this.options.showStatus == "undefined" || this.options.showStatus == "true") {
                    var property = this.options.getReceiptDocumentStatusProperty;
                    var status = this.model.getReceiptDocumentStatusProperty(property);
                    var icons = {
                        "Approved": gettext("Your file has been approved<br/><b>SUCCESSFULLY</b>"),
                        "File Missing": gettext("Attachments are required,<br/>please check <b>attached missing</b>"),
                        "Approvingly": gettext("Los archivos adjuntos se encuentran en<br/><b>aprobación y verificación</b>"),
                        "Reload": gettext("Please<b>reload</b> files attached<br/>"),
                        "Suggested": gettext("Suggested file"),
                        "Loadded": gettext("Loadded file"),
                    };
                    return icons[status];
                }
                return "fa-smile";
            },

            documentChangeSucceeded: function (e, data) {
                var view = this;
                // Update model to get the latest urls of profile image.
                this.model.fetch().done(function () {
                    view.setCurrentStatus('');
                    view.render();
                    view.$('.u-field-upload-button').focus();
                }).fail(function () {
                    view.setCurrentStatus('');
                    view.showErrorMessage(view.errorMessage);
                });

                var message = this.successMessage(e, data);
                this.showSuccessMessage(message);
            },

            documentChangeFailed: function (e, data) {
                this.setCurrentStatus('');
                this.showDocumentChangeFailedMessage(data.jqXHR.status, data.jqXHR.responseText);
                this.errorHandler(e, data);
            },

            showDocumentChangeFailedMessage: function (status, responseText) {
                if (_.contains([400, 404], status)) {
                    try {
                        var errors = JSON.parse(responseText);
                        this.showErrorMessage(errors.user_message);
                    } catch (error) {
                        this.showErrorMessage(this.errorMessage);
                    }
                } else {
                    this.showErrorMessage(this.errorMessage);
                }
            },

            showMessage: function (message) {
                this.options.messageView.showMessage(message);
            },

            showSuccessMessage: function (message) {
                this.options.messageView.options.urgency = 'low';
                this.options.messageView.options.type = 'confirmation';
                this.showMessage(message);
            },

            showErrorMessage: function (message) {
                this.options.messageView.options.urgency = 'high';
                this.options.messageView.options.type = 'error';
                this.showMessage(message);
            },

            isShowingPlaceholder: function () {
                var property = this.options.hasReceiptDocumentProperty;
                return !this.model.hasReceiptDocumentProperty(property);
            },

            clickedRemoveButton: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            },

            fileSelected: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            },

            successMessage: function (event, data) {
                var message = gettext("Your file has been deleted.");
                if (typeof data != 'undefined') {
                    var file = data.files[0].name;
                    message = interpolate_text(
                        gettext("Your file '{file}' has been uploaded. Allow a few minutes for processing."), {file: file}
                    );
                }
                return this.indicators.success + "&nbsp;" + message;
            }
        });

        MentorSettingsFieldViews.ProfileImageFieldView = ImageFieldView.extend({

            screenReaderTitle: gettext('Profile Image'),

            imageUrl: function () {
                return this.model.profileImageUrl();
            },

            imageAltText: function () {
                return interpolate_text(
                    gettext("Profile image for {username}"), {username: this.model.get('username')}
                );
            },

            imageChangeSucceeded: function (e, data) {
                var view = this;
                // Update model to get the latest urls of profile image.
                this.model.fetch().done(function () {
                    view.setCurrentStatus('');
                    view.render();
                    view.$('.u-field-upload-button').focus();
                }).fail(function () {
                    view.setCurrentStatus('');
                    view.showErrorMessage(view.errorMessage);
                });
            },

            imageChangeFailed: function (e, data) {
                this.setCurrentStatus('');
                this.showImageChangeFailedMessage(data.jqXHR.status, data.jqXHR.responseText);
            },

            showImageChangeFailedMessage: function (status, responseText) {
                if (_.contains([400, 404], status)) {
                    try {
                        var errors = JSON.parse(responseText);
                        this.showErrorMessage(errors.user_message);
                    } catch (error) {
                        this.showErrorMessage(this.errorMessage);
                    }
                } else {
                    this.showErrorMessage(this.errorMessage);
                }
            },

            showErrorMessage: function (message) {
                this.options.messageView.showMessage(message);
            },

            isEditingAllowed: function () {
                return this.model.isAboveMinimumAge();
            },

            isShowingPlaceholder: function () {
                return !this.model.hasProfileImage();
            },

            clickedRemoveButton: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            },

            fileSelected: function (e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            }
        });

        MentorSettingsFieldViews.DateOfBirthFieldView = DateOfBirthFieldView.extend({

        });

        return MentorSettingsFieldViews;
    });
}).call(this, define || RequireJS.define);

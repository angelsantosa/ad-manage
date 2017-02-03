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
        'js/views/fields_custom', 'js/views/file_uploader_field', 'js/views/gmap_field', 'js/views/grid_field',
        'text!templates/fields_custom/field_text_publish.underscore',
        'text!templates/fields_custom/field_textarea_publish.underscore',
        'text!templates/fields_custom/field_readonly_publish.underscore',
        'text!templates/fields_custom/field_dropdown_publish.underscore',
        'text!templates/fields_custom/field_dropdown_group_publish.underscore',
        'text!templates/fields_custom/field_radio_publish.underscore',
        'text!templates/fields_custom/field_slider_publish.underscore',
        'text!templates/fields_custom/field_schedule_publish.underscore',
        'text!templates/fields_custom/field_schedule_tag_publish.underscore',
        'text!templates/fields_custom/field_file_upload_publish.underscore',
        // Plugins que no proporcionan objetos en la función, se unen a jquery
        'jquery.fileupload', 'jquery.ui.slider-pips', 'clockpicker', 'select2'
    ], function (gettext, $, _, Backbone, FieldViews, FileUploaderView, GMapFieldView, GridFieldView,
                 field_text_publish_template,
                 field_textarea_publish_template,
                 field_readonly_publish_template,
                 field_dropdown_publish_template,
                 field_dropdown_group_publish_template,
                 field_radio_publish_template,
                 field_slider_publish_template,
                 field_schedule_publish_template,
                 field_schedule_tag_publish_template,
                 field_file_upload_publish_template
    ) {

        var PublishFieldViews = {};

        PublishFieldViews.TextFieldView = FieldViews.TextFieldView.extend({

            helpMessage: '',
            tagName: 'span',

            fieldTemplate: field_text_publish_template,

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    message: this.options.helpMessage,
                    iconClass: this.options.iconClass,
                    placeholder: this.options.placeholder,
                    value: this.modelValue(),
                    showHeader: this.options.showHeader,
                }));
                this.delegateEvents();
                return this;
            },

        });

        PublishFieldViews.TextareaFieldView = FieldViews.TextareaFieldView.extend({

            helpMessage: '',
            tagName: 'span',

            fieldTemplate: field_textarea_publish_template,

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    message: this.options.helpMessage,
                    iconClass: this.options.iconClass,
                    placeholder: this.options.placeholder,
                    value: this.modelValue(),
                    showHeader: this.options.showHeader,
                }));
                this.delegateEvents();
                return this;
            },

        });

        PublishFieldViews.DropdownFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_dropdown_publish_template,

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    mode: this.mode,
                    editable: this.editable,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    iconName: this.options.iconName,
                    showBlankOption: (!this.options.required || !this.modelValueIsSet()),
                    selectOptions: this.options.options,
                    message: this.helpMessage,
                    showHeader: this.options.showHeader
                }));
                this.delegateEvents();
                return this;
            },

        });

        PublishFieldViews.DropdownGroupsFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_dropdown_group_publish_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender');
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
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    message: this.helpMessage
                }));
                this.delegateEvents();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
                var arrayData = this.options.options
                var category = new Array();
                _.each(arrayData, function(value, index){
                    var jsonData = new Object();
                    jsonData.id = index;
                    jsonData.text = value[0];
                    var children = new Array();
                    _.each(value[1], function(subvalue){
                        var jsonData = new Object();
                        jsonData.id = subvalue[0];
                        jsonData.text = subvalue[1];
                        children.push(jsonData);
                    });
                    jsonData.children = children;
                    category.push(jsonData);
                });

                this.$(".u-field-custom-select-" + this.options.valueAttribute).select2({
                    placeholder: gettext('Select Category'),
                    allowClear: false,
                    data: category
                });
            },

        });

        PublishFieldViews.SliderFieldView = FieldViews.EditableFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_slider_publish_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender');
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
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    message: this.helpMessage
                }));
                this.delegateEvents();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
                // Inicializar el slider
                this.options.values = _.pluck(this.options.options, '0');
                this.options.levels = _.pluck(this.options.options, '1');
                var selected = _.indexOf(this.options.values, this.modelValue(), true);
                var view = this;
                view.$(".u-field-custom-slider-" + this.options.valueAttribute)
                // Establecer los limites del slider
                .slider({
                     min: 0,
                     max: this.options.values.length - 1,
                     value: selected
                })
                // Establecer etiquetas
                .slider("pips", {
                    rest: "label",
                    labels: this.options.levels
                })
                // and whenever the slider changes, lets echo out
                .on("slidechange", function(e, ui) {
                    view.$(".u-field-custom-slider-output").text(
                        gettext("You have changed to ") + view.options.levels[ui.value]
                    );
                    view.finishEditing(e, ui)
                });
            },

            fieldValue: function () {
                var selectedValue = this.$(".u-field-custom-slider-" +
                                    this.options.valueAttribute).slider("option", "value");
                return this.options.values[selectedValue || 0];
            },

            finishEditing: function(e, ui) {
                if (this.persistChanges === false || this.mode !== 'edit') {return;}
                if (parseInt(this.fieldValue()) !== this.modelValue()) {
                    this.saveValue();
                }
            },

            saveValue: function () {
                var attributes = {};
                attributes[this.options.valueAttribute] = this.fieldValue();
                this.saveAttributes(attributes);
            },
        });

        PublishFieldViews.ScheduleTagFieldView = FieldViews.EditableFieldView.extend({
            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_schedule_tag_publish_template,

            events: {
                'click .course-schedule-tag-action': 'removeSchedule',
            },

            render: function () {
                this.$el.html(this.template({
                    dayOfWeek: this.options.dayOfWeek,
                    timeDisplay: this.timeDisplay(),
                    message: this.helpMessage
                }));
                this.delegateEvents();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            timeDisplay: function () {
                return this.options.timeStart + ' - ' + this.options.timeEnd;
            },

            removeSchedule: function () {
                var view = this;
                // this.setCurrentStatus('removing');
                // this.setUploadButtonVisibility('none');
                // this.showRemovalInProgressMessage();
                $.ajax({
                    type: 'DELETE',
                    url: this.options.url + '/' + this.options.scheduleId,
                }).done(function () {
                    view.scheduleTagChangeSucceeded();
                }).fail(function (jqXHR) {
                    view.showScheduleTagChangeFailedMessage(jqXHR.status, jqXHR.responseText);
                });
            },

            scheduleTagChangeSucceeded: function () {
                var view = this;

                var showLoadingError = function () {
                    showScheduleTagChangeFailedMessage('404', 'No data could be fetched');
                };

                var showAccountFields = function () {
                    // Render the fields
                    view.options.iAmYourFather.render();
                    view.options.iAmYourFather.saveSucceeded();
                };

                view.options.iAmYourFather.model.fetch({
                    success: showAccountFields,
                    error: showLoadingError
                });
            },

            showScheduleTagChangeFailedMessage: function (status, responseText) {
                console.log("Tag Schedule Failed!");
                console.log(status);
                console.log(responseText);
            },
        });

        PublishFieldViews.ScheduleFieldView = FieldViews.EditableFieldView.extend({
            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_schedule_publish_template,

            events: {
                'click .action': 'addSchedule',
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender');
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
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    showBlankOption: true,
                    blankOption: gettext("Days"),
                    selectOptions: this.options.options,
                    message: this.helpMessage
                }));
                this.delegateEvents();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
                this.$('#daterange-publish-basic').daterangepicker({
                    "showDropdowns": true,
                    "linkedCalendars": false,
                    "startDate": "02/12/2016",
                    "endDate": "02/18/2016",
                    "opens": "left"
                }, function(start, end, label) {
                  console.log("New date range selected: "+ start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
                });

                var options = {
                    placement: 'top',
                    autoclose: true,
                    align: 'left',
                    donetext: gettext("Done")
                };

                // Separar eventos de horario inicio y fin para validaciones

                this.$(".clockpicker.start").clockpicker(
                    $.extend(options, {
                    afterDone: function() {
                        console.log("after start");
                    }})
                );

                this.$(".clockpicker.end").clockpicker(
                    $.extend(options, {
                    afterDone: function() {
                        console.log("after end");
                    }})
                );

                var view = this;
                _.each(this.modelValue(), function(tag) {
                    var options = {
                        url: view.options.url,
                        scheduleId: tag.schedule_id,
                        dayOfWeek: view.options.options[tag.day_of_week][1],
                        timeStart: tag.time_start,
                        timeEnd: tag.time_end,
                        iAmYourFather: view
                    };
                    var field = new PublishFieldViews.ScheduleTagFieldView(options);
                    view.$('.container-course-detail-calendar-schedule').append(field.render().el);
                });
            },

            addSchedule: function () {
                var view = this;

                var dayOfWeek = this.$("#u-field-custom-select-" + this.options.valueAttribute).val() || '';
                var timeStart = this.$(".clockpicker.start > input").val() || '';
                var timeEnd = this.$(".clockpicker.end > input").val() || '';

                if (dayOfWeek === '' ||
                    timeStart === '' ||
                    timeEnd === ''
                ) {
                    view.showScheduleChangeFailedMessage('404', 'Validate data!!!');
                    return;
                }

                // this.setCurrentStatus('adding');
                // this.setUploadButtonVisibility('none');
                // this.showRemovalInProgressMessage();

                $.ajax({
                    type: 'POST',
                    data : {
                        'day_of_week' : dayOfWeek,
                        'time_start': timeStart,
                        'time_end': timeEnd
                    },
                    url: view.options.url
                }).done(function () {
                    view.scheduleChangeSucceeded();
                }).fail(function (jqXHR) {
                    view.showScheduleChangeFailedMessage(jqXHR.status, jqXHR.responseText);
                });
            },

            scheduleChangeSucceeded: function () {
                var view = this;

                var showLoadingError = function () {
                    showScheduleChangeFailedMessage('404', 'No data could be fetched');
                };

                var showAccountFields = function () {
                    // Render the fields
                    view.render();
                    view.saveSucceeded();
                };

                view.model.fetch({
                    success: showAccountFields,
                    error: showLoadingError
                });
            },

            showScheduleChangeFailedMessage: function (status, responseText) {
                console.log("Failed!");
                console.log(status);
                console.log(responseText);
            },

        });

        PublishFieldViews.RadioFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_radio_publish_template,

            events: {
                'click .toggle-btn:not(".noscript") input[type=radio]': 'startEditing',
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender');
                this.render = _.wrap(this.render, function(render) {
                  render.apply(this);
                  this.afterRender();
                  return this;
                });
            },

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    mode: this.mode,
                    editable: this.editable,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    iconName: this.options.iconName,
                    radioOptions: this.options.options,
                    iconOptions: this.options.iconOptions,
                    classOptions: this.options.classOptions,
                    message: this.helpMessage
                }));
                this.delegateEvents();
                this.updateValueInField();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
                this.$(".toggle-btn:not('.noscript') input[type=radio]").addClass("visuallyhidden");
            },

            fieldValue: function () {
                return this.$('input[type="radio"]:checked').val();
            },

            startEditing: function () {
                if (this.editable === 'toggle' && this.mode !== 'edit') {
                    this.showEditMode(true);
                }
                this.finishEditing();
            },

            finishEditing: function() {
                if (this.persistChanges === false || this.mode !== 'edit') {return;}
                if (parseInt(this.fieldValue()) !== this.modelValue()) {
                    this.saveValue();
                }
            },

            updateValueInField: function () {
                if (this.editable !== 'never') {
                    this.$('input[type="radio"]').val([this.modelValue() || 0]);
                    this.$('input[type="radio"]:checked').parent().siblings().removeClass("success");
                    this.$('input[type="radio"]:checked').parent().toggleClass("success");
                }
            },

        });

        PublishFieldViews.ReadOnlyDropdownFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_dropdown_publish_template,

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    showBlankOption: (!this.options.required || !this.modelValueIsSet()),
                    selectOptions: this.options.options,
                    message: this.helpMessage
                }));
                this.delegateEvents();
                return this;
            },

            modelValue: function () {
                return null;
            }

        });

        PublishFieldViews.GridFieldView = GridFieldView.extend({

            beforeRender: function () {
                // Transformar la lista de recursos del tipo photo
                // en title y url
                var data = [];
                var info = _.each(
                    _.where(this.modelValue(), {type: 0}), function (list) {
                        var filter = _.pick(list, 'name', 'url');
                        var photo = {};
                        photo['title'] = filter['name'];
                        photo['url'] = filter['url'];
                        data.push(photo);
                    }
                );
                this.options.data = data;
            },

            initialize: function (options) {
                this._super(options);

                _.bindAll(this, 'beforeRender');
                this.render = _.wrap(this.render, function(render) {
                  this.beforeRender();
                  render.apply(this);
                  return this;
                });
            },
        });

        PublishFieldViews.ReadonlyFieldView = FieldViews.ReadonlyFieldView.extend({

            tagName: 'ul',
            className: function () {
                return 'list-unstyled';
            },

            fieldTemplate: field_readonly_publish_template,

            beforeRender: function () {
                console.log('beforeRender');
                // Transformar la lista de recursos del tipo photo
                // en title y url
                var data = [];
                var info = _.each(
                    _.where(this.modelValue(), {type: this.options.type}), function (list) {
                        var filter = _.pick(list, 'name', 'url');
                        var resource = {};
                        resource['title'] = filter['name'];
                        resource['url'] = filter['url'];
                        data.push(resource);
                    }
                );
                console.log(data);
                this.options.data = data;
            },

            initialize: function (options) {
                this._super(options);

                console.log('initialize');

                _.bindAll(this, 'beforeRender');
                this.render = _.wrap(this.render, function(render) {
                  this.beforeRender();
                  render.apply(this);
                  return this;
                });
            },

            render: function () {
                var view = this;

                _.each(view.options.data, function (resource) {
                    var reourceView = view.template({
                        resourceUrl: resource['url'],
                        title: resource['title'],
                        toolbarVisible: _.result(view, 'toolbarVisible'),
                        titleVisible: _.result(view, 'titleVisible')
                    });
                    view.$el.append(reourceView);
                });
                this.delegateEvents();
                return this;
            },

            toolbarVisible: function () {
                return false;
            },

            titleVisible: function () {
                return true;
            },
        });

        PublishFieldViews.LanguagePreferenceFieldView = FieldViews.DropdownFieldView.extend({

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

        PublishFieldViews.PasswordFieldView = FieldViews.LinkFieldView.extend({

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

        PublishFieldViews.LanguageProficienciesFieldView = FieldViews.DropdownFieldView.extend({

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

        PublishFieldViews.AuthFieldView = FieldViews.LinkFieldView.extend({

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

        PublishFieldViews.AuthSocialNetworkFieldView = FieldViews.LinkSocialNetworkFieldView.extend({

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

        PublishFieldViews.FileUploadFieldView = FileUploaderView.extend({

            fieldTemplate: field_file_upload_publish_template,

            screenReaderTitle: gettext('Mentor Document'),

            uploadButtonIcon: 'fa-upload',

            documentUrl: function() {
                // var property = this.options.receiptDocumentUrlProperty;
                // return this.model.receiptDocumentUrlProperty(property);
                return "http://#";
            },

            documentStatus: function () {
                // var property = this.options.getReceiptDocumentStatusProperty;
                // var message = this.model.getReceiptDocumentStatusProperty(property);
                // return gettext(message);
                return gettext("OK");
            },

            documentIconStatus: function () {
                if (typeof this.options.showStatus == "undefined" || this.options.showStatus == "true") {
                    // var property = this.options.getReceiptDocumentStatusProperty;
                    // var status = this.model.getReceiptDocumentStatusProperty(property);
                    var icons = {
                        "Approved": "fa-clipboard",
                        "File Missing": "fa-file-o",
                        "Approvingly": "fa-search",
                        "Reload": "fa-unknow",
                        "Suggested": "fa-unknow",
                        "Loadded": "fa-unknow"
                    };
                    // return icons[status];
                    return "fa-clipboard";
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
                // var property = this.options.hasReceiptDocumentProperty;
                // return !this.model.hasReceiptDocumentProperty(property);
                return true;
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

        PublishFieldViews.GMapFieldView = GMapFieldView.extend({

            useGeocode: false,

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    message: this.options.helpMessage,
                    showTitle: false
                }));
                this.delegateEvents();
                return this;
            },

        });

        return PublishFieldViews;
    });
}).call(this, define || RequireJS.define);

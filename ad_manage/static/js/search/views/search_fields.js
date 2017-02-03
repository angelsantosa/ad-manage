define([
        'gettext', 'jquery', 'underscore', 'backbone',
        'search/models/multi_field_m',
        'text!templates/search/fields_custom/field_text.underscore',
        'text!templates/search/fields_custom/field_readonly.underscore',
        'text!templates/search/fields_custom/field_dropdown.underscore',
        'text!templates/search/fields_custom/field_slider.underscore',
        'text!templates/search/fields_custom/field_radio.underscore',
        'text!templates/search/result_card.underscore',
        'text!templates/search/fields_custom/field_location.underscore',
        'text!templates/search/fields_custom/field_text_top.underscore',
        'text!templates/search/fields_custom/field_radio_categories.underscore',
        'text!templates/search/fields_custom/field_radio_neutral.underscore',
        'text!templates/search/fields_custom/field_slider_range.underscore',
        'text!templates/search/result_card_small.underscore',
        'text!templates/search/fields_custom/field_check_type.underscore',
        'echarli/icheck_settings',
        'backbone-super'
    ], function (gettext, $, _, Backbone,
                 MultiFieldModel,
                 field_text_template,
                 field_readonly_template,
                 field_dropdown_template,
                 field_slider_template,
                 field_radio_template,
                 result_card_view,
                 field_location_template,
                 field_text_top_template,
                 field_radio_categories_template,
                 field_radio_neutral_template,
                 field_slider_range_template,
                 searchTemplateResultCardSmall,
                 field_radio_type_template,
                 runCustomCheck
    ) {

        var messageRevertDelay = 6000; // Delay del mensaje
        var FieldViews = {}; // Areglo de views
        // Variables globales porque VETE A LA VERGA GOOGLE
        var googleMarkers = [];
        var markers_there = 0;

        Backbone.View = (function(View) {
           return View.extend({
                constructor: function(options) {
                    this.options = options || {};
                    View.apply(this, arguments);
                }
            });
        })(Backbone.View);

        var ResultsFilteredView = Backbone.View.extend({

          el: '.search-results',

          fieldTemplate: result_card_view,

          initialize: function () {

            this.template = _.template(this.fieldTemplate || '');
            // super
            _.bindAll(this, 'render');
          },

          render: function(){

            this.$el.html(this.template({
              resultsJ: this.options.resultsJ,
              usersJ: this.options.usersJ
        		}));
        		return this;

          },

        });

        var CardsToRenderView = Backbone.View.extend({

          fieldTemplate: searchTemplateResultCardSmall,

          initialize: function () {
            this.template = _.template(this.fieldTemplate || '');
            _.bindAll(this, 'render');
          },

          render: function(){
            this.$el.html(this.template({
              resultsJ: this.options.resultsJ,
              usersJ: this.options.usersJ
            }));
            return this;
          }

        });

        FieldViews.FieldView = Backbone.View.extend({

            initialize: function () {

                this.map;
                this.template = _.template(this.fieldTemplate || '');

                this.helpMessage = this.options.helpMessage || '';

                this.showMessages = _.isUndefined(this.options.showMessages) ? true : this.options.showMessages;

                _.bindAll(this, 'modelValue', 'modelValueIsSet', 'showNotificationMessage','getNotificationMessage',
                    'getMessage', 'title', 'showHelpMessage', 'showInProgressMessage', 'showSuccessMessage',
                    'showErrorMessage'
                );
            },

            fieldType: 'generic',

            className: function () {
                return 'u-field' + ' u-field-' + this.fieldType + ' u-field-' + this.options.valueAttribute;
            },

            tagName: 'div',

            indicators: {
                'canEdit': '<i class="icon fa fa-pencil message-can-edit" aria-hidden="true"></i><span class="sr">' + gettext("Editable") + '</span>',
                'error': '<i class="fa fa-exclamation-triangle message-error" aria-hidden="true"></i><span class="sr">' + gettext("Error") + '</span>',
                'validationError': '<i class="fa fa-exclamation-triangle message-validation-error" aria-hidden="true"></i><span class="sr">' + gettext("Validation Error") + '</span>',
                'inProgress': '<i class="fa fa-spinner fa-pulse message-in-progress" aria-hidden="true"></i><span class="sr">' + gettext("In Progress") + '</span>',
                'success': '<i class="fa fa-check message-success" aria-hidden="true"></i><span class="sr">' + gettext("Success") + '</span>',
                'plus': '<i class="fa fa-plus placeholder" aria-hidden="true"></i><span class="sr">' + gettext("Placeholder")+ '</span>'
            },

            messages: {
                'canEdit': '',
                'error': gettext('An error occurred. Please try again.'),
                'validationError': '',
                'inProgress': gettext('Saving'),
                'success': gettext('Your changes have been saved.')
            },

            setMap: function (map_view) {

              this.map = map_view;
              return this;

            },

            modelValue: function () {
                return this.model.get(this.options.valueAttribute);
            },

            modelValueIsSet: function() {
                return (this.modelValue() === true);
            },

            title: function (text) {
                return this.$('.u-field-custom-title').html(text);
            },

            getMessage: function(message_status) {
                if ((message_status + 'Message') in this) {
                    return this[message_status + 'Message'].call(this);
                } else if (this.showMessages) {
                    return this.indicators[message_status] + this.messages[message_status];
                }
                return this.indicators[message_status];
            },

            showHelpMessage: function (message) {
                if (_.isUndefined(message) || _.isNull(message)) {
                    message = this.helpMessage;
                }
                this.$('.u-field-custom-message-notification').html('');
                this.$('.u-field-custom-message-help').html(message);
            },

            getNotificationMessage: function() {
                return this.$('.u-field-custom-message-notification').html();
            },

            showNotificationMessage: function(message) {
                this.$('.u-field-custom-message-help').html('');
                this.$('.u-field-custom-message-notification').html(message);
            },

            showCanEditMessage: function(show) {
                if (!_.isUndefined(show) && show) {
                    this.showNotificationMessage(this.getMessage('canEdit'));
                } else {
                    this.showNotificationMessage('');
                }
            },

            showInProgressMessage: function () {
                this.showNotificationMessage(this.getMessage('inProgress'));
            },

            showSuccessMessage: function () {
                var successMessage = this.getMessage('success');
                this.showNotificationMessage(successMessage);

                if (this.options.refreshPageOnSave) {
                    document.location.reload();
                }

                var view = this;

                var context = Date.now();
                this.lastSuccessMessageContext = context;

                setTimeout(function () {
                    if ((context === view.lastSuccessMessageContext) && (view.getNotificationMessage() === successMessage)) {
                        if (view.editable === 'toggle') {
                            view.showCanEditMessage(true);
                        } else {
                            view.showHelpMessage();
                        }
                    }
                }, messageRevertDelay);
            },

            showErrorMessage: function (xhr) {
                if (xhr.status === 400) {
                    try {
                        var errors = JSON.parse(xhr.responseText),
                            validationErrorMessage = _.escape(
                                errors.field_errors[this.options.valueAttribute].user_message
                            ),
                            message = this.indicators.validationError + validationErrorMessage;
                        this.showNotificationMessage(message);
                    } catch (error) {
                        this.showNotificationMessage(this.getMessage('error'));
                    }
                } else {
                    this.showNotificationMessage(this.getMessage('error'));
                }
            }
        });

        FieldViews.EditableFieldView = FieldViews.FieldView.extend({

            initialize: function (options) {
                this.persistChanges = _.isUndefined(options.persistChanges) ? false : options.persistChanges;
                _.bindAll(this, 'saveAttributes', 'saveSucceeded', 'showDisplayMode', 'showEditMode',
                    'startEditing', 'finishEditing','updateResults'
                );
                this._super(options);

                this.editable = _.isUndefined(this.options.editable) ? 'always': this.options.editable;
                this.$el.addClass('editable-' + this.editable);

                if (this.editable === 'always') {
                    this.showEditMode(false);
                } else {
                    this.showDisplayMode(false);
                }

            },

            updateResults: function(filterModel){

              var cardElement = $('.cardsToRender');
              var counter_c_element= $(".total-courses");
              var dis = this;
              // googleMarkers
              var api_url = this.options.course_api;

              var usersC = this.collection.usersCollection;
              var resultsC = this.collection.resultsCollection;

              api_url = resultsC.search(filterModel, api_url);
              resultsC.url = api_url;

              var total_courses;
              var map_view_ = _.isEmpty(this.map) ? false : this.map;
              $.when(
                resultsC.fetch(),
                usersC.fetch()
                ).then(function(){
                  var resultsJ = resultsC.toJSON();
                  var usersJ = usersC.toJSON();
                  total_courses = resultsC.length;
                  console.log(total_courses);
                  if(total_courses>=1){
                    if(total_courses==1){

                      counter_c_element.html("<b>1 Curso encontrado.");

                    }else{
                      counter_c_element.html("<b>"+ total_courses + " cursos encontrados.</b>");

                    }
                  }else{
                    counter_c_element.html("<b>No se encontraron cursos.</b>");

                  }

                  var resultadosView = new ResultsFilteredView({
                    resultsJ: resultsJ,
                    usersJ: usersJ

                  });
                  resultadosView.render();

                  if(map_view_ && filterModel.has("from")){

                    if(markers_there==1){
                      map_view_.removeMarkers();
                    }
                    googleMarkers= [];
                    var cardsViews = new CardsToRenderView({
                      el: cardElement,
                      resultsJ: resultsJ,
                      usersJ: usersJ,
                    });
                    cardsViews.render();
                    _.each(resultsJ, function (result, index) {
                      googleMarkers.push({
                          position: new google.maps.LatLng(result.location_latitude,result.location_longitude),
                          icon: "https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|$ " + result.price_program + "|D7DF23|000000",
                          infoWindow: {
                          content: $('#card_result_'+result.id).text()
                          },
                      });
                    });
                    map_view_.addMarkers(googleMarkers);
                    markers_there=1;
                  }
              });

            },

            saveAttributes: function (attributes, options) {
                if (this.persistChanges === true) {
                    var view = this;
                    var defaultOptions = {
                        contentType: 'application/merge-patch+json',
                        patch: true,
                        wait: true,
                        success: function () {
                            view.saveSucceeded();
                        },
                        error: function (model, xhr) {
                            view.showErrorMessage(xhr);
                        }
                    };

                    this.model.save(attributes, _.extend(defaultOptions, options));


                    this.showInProgressMessage(); // Loding

                }
            },

            saveSucceeded: function () {
                this.showSuccessMessage();
            },

            updateDisplayModeClass: function() {
                this.$el.removeClass('mode-edit');

                this.$el.toggleClass('mode-hidden', (this.editable === 'never' && !this.modelValueIsSet()));
                this.$el.toggleClass('mode-placeholder', (this.editable === 'toggle' && !this.modelValueIsSet()));
                this.$el.toggleClass('mode-display', (this.modelValueIsSet()));
            },

            showDisplayMode: function(render) {
                this.mode = 'display';
                if (render) { this.render(); }
                this.updateDisplayModeClass();
            },

            showEditMode: function(render) {
                this.mode = 'edit';
                if (render) { this.render(); }

                this.$el.removeClass('mode-hidden');
                this.$el.removeClass('mode-placeholder');
                this.$el.removeClass('mode-display');

                this.$el.addClass('mode-edit');
            },

            startEditing: function () {
                if (this.editable === 'toggle' && this.mode !== 'edit') {
                    this.showEditMode(true);
                }
            },

            finishEditing: function() {
                if (this.persistChanges === false || this.mode !== 'edit') {return;}
                if (this.fieldValue() !== this.modelValue()) {
                    this.saveValue();
                } else {
                    if (this.editable === 'always') {
                        this.showEditMode(true);
                    } else {
                        this.showDisplayMode(true);
                    }
                }
            },

            highlightFieldOnError: function () {
                this.$el.addClass('error');
            },

            unhighlightField: function () {
                this.$el.removeClass('error');
            }
        });

        FieldViews.ReadonlyFieldView = FieldViews.FieldView.extend({

            fieldType: 'readonly',

            fieldTemplate: field_readonly_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'fieldValue', 'updateValueInField');
                this.listenTo(this.model, "change:" + this.options.valueAttribute, this.updateValueInField);
            },

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    value: this.modelValue(),
                    message: this.helpMessage
                }));
                this.delegateEvents();
                return this;
            },

            fieldValue: function () {
                return this.$('.u-field-custom-value').text();
            },

            updateValueInField: function () {
                this.$('.u-field-custom-value ').html(_.escape(this.modelValue()));
            }
        });

        FieldViews.TextFieldView = FieldViews.EditableFieldView.extend({

            fieldType: 'text',

            fieldTemplate: field_text_template,

            events: {
                'change input': 'saveValue'
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'fieldValue', 'updateValueInField', 'saveValue');
                this.listenTo(this.model, "change:" + this.options.valueAttribute, this.updateValueInField);
            },

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute,
                    title: this.options.title,
                    iconClass: this.options.iconClass,
                    value: this.modelValue(),
                    message: this.helpMessage,
                    placeholder: this.options.placeholder
                }));
                this.delegateEvents();
                return this;
            },

            fieldValue: function () {
                return this.$('.u-field-custom-value input').val();
            },

            updateValueInField: function () {
                var value = (_.isUndefined(this.modelValue()) || _.isNull(this.modelValue())) ? '' : this.modelValue();
                this.$('.u-field-custom-value input').val(_.escape(value));
            },

            saveValue: function () {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,this.fieldValue());
                this.updateResults(localModel);
            }
        });

        FieldViews.DateRangeFieldView = FieldViews.EditableFieldView.extend({

            fieldType: 'text',

            fieldTemplate: field_text_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'fieldValue', 'updateValueInField', 'saveValue');
                this.listenTo(this.model, "change:" + this.options.valueAttribute, this.updateValueInField);
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
                    iconClass: this.options.iconClass,
                    value: this.modelValue(),
                    message: this.helpMessage,
                    placeholder: this.options.placeholder
                }));
                this.delegateEvents();
                return this;
            },

            afterRender: function(){

              var dis =this;

              var today = new Date();
              var in_a_month = new Date();
              var dd = today.getDate();
              var mm = today.getMonth()+1; //January is 0!
              var mm_plus1=today.getMonth()+2;
              var yyyy = today.getFullYear();
              if(dd<10) {
                  dd='0'+dd
              }

              if(mm<10) {
                  mm='0'+mm
              }

              today = mm+'/'+dd+'/'+yyyy;
              in_a_month = mm_plus1+'/'+dd+'/'+yyyy;

              this.$('.u-field-custom-value input').daterangepicker({
                          "showDropdowns": true,
                          "autoApply": true,
                          "startDate": today,
                          "endDate": in_a_month,
                          "opens": "center"
                      }, function(start, end, label) {
                        var start_date = start.format('YYYY-MM-DD');
                        var end_date = end.format('YYYY-MM-DD');
                      dis.saveValue(start_date,end_date);

                      });

              setTimeout(function () {

              },500);


            },

            fieldValue: function () {
                return this.$('.u-field-custom-value input').val();
            },

            updateValueInField: function () {
                var value = (_.isUndefined(this.modelValue()) || _.isNull(this.modelValue())) ? '' : this.modelValue();
                this.$('.u-field-custom-value input').val(_.escape(value));
            },

            saveValue: function (date1,date2) {
              var localModel =this.model;
              localModel.set(this.options.valueAttribute[0],date1);
              localModel.set(this.options.valueAttribute[1],date2);
              this.updateResults(localModel);
            }
        });

        FieldViews.TextFieldTopView = FieldViews.EditableFieldView.extend({

            fieldType: 'text',

            fieldTemplate: field_text_top_template,

            events: {
                'change input': 'saveValue'
            },

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'fieldValue', 'updateValueInField', 'saveValue');
                this.listenTo(this.model, "change:" + this.options.valueAttribute, this.updateValueInField);
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
                    iconClass: this.options.iconClass,
                    value: this.modelValue(),
                    message: this.helpMessage,
                    placeholder: this.options.placeholder
                }));
                this.delegateEvents();
                return this;
            },

            afterRender: function () {
              setTimeout(function () {
              $(".search-input-big").prependTo(".search-input-big-2");
              $(".search-input-big-2").css("height","76px");
            },500);
            },

            fieldValue: function () {
                return this.$('.u-field-custom-value input').val();
            },

            updateValueInField: function () {
                var value = (_.isUndefined(this.modelValue()) || _.isNull(this.modelValue())) ? '' : this.modelValue();
                this.$('.u-field-custom-value input').val(_.escape(value));
            },

            saveValue: function () {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,this.fieldValue());
                this.updateResults(localModel);
            }
        });


        FieldViews.LocationFieldView = FieldViews.EditableFieldView.extend({

            fieldType: 'gmapsfield',

            fieldTemplate: field_location_template,

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender','setMap');
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
                    iconClass: this.options.iconClass,
                    value: this.modelValue(),
                    message: this.helpMessage,
                    placeholder: this.options.placeholder
                }));
                this.delegateEvents();
                return this;
            },

            afterRender: function () {
              var dis = this;

              var gmaps_input = document.getElementById('u-field-custom-input-gmaps');
              setTimeout(function () {



                var map_end = dis.map;
                var km = dis.options.km_to_search;
                var zm = dis.options.zoom_in_map_change;

                var autocomplete = new google.maps.places.Autocomplete(document.getElementById('u-field-custom-input-gmaps'), {
                    types: ["geocode"]
                });

                autocomplete.bindTo('bounds', map_end);

                google.maps.event.addListener(autocomplete, 'place_changed', function() {

                    var place = autocomplete.getPlace();
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();
                    var latlng_ = lat + ',' + lng;


                    if (place.geometry.viewport) {
                      map_end.fitBounds(place.geometry.viewport);
                    } else {
                      map_end.setCenter({
                        lat:lat, lng:lng
                      });
                    }

                    map_end.setZoom(zm);  // Why 17? Because it looks good.
                    dis.saveValue(latlng_,km);


                });

              },500);

            },

            fieldValue: function () {
                return this.$('.u-field-custom-value input').val();
            },

            updateValueInField: function () {
                var value = (_.isUndefined(this.modelValue()) || _.isNull(this.modelValue())) ? '' : this.modelValue();
                this.$('.u-field-custom-value input').val(_.escape(value));
            },

            saveValue: function (latlng,km) {
              var localModel = this.model;
                localModel.set(this.options.valueAttribute[0],latlng);
                localModel.set(this.options.valueAttribute[1],km);
                this.updateResults(localModel);
            }
        });

        FieldViews.DropdownFieldView = FieldViews.EditableFieldView.extend({

            fieldType: 'dropdown',

            fieldTemplate: field_dropdown_template,

            events: {
                'click': 'startEditing',
                'change select': 'finishEditing',
                'focusout select': 'finishEditing'
            },

            initialize: function (options) {
                _.bindAll(this, 'render', 'optionForValue', 'fieldValue', 'displayValue', 'updateValueInField', 'saveValue');
                this._super(options);

                this.listenTo(this.model, "change:" + this.options.valueAttribute, this.updateValueInField);
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
                    showBlankOption: (!this.options.required || !this.modelValueIsSet()),
                    selectOptions: this.options.options,
                    message: this.helpMessage
                }));
                this.delegateEvents();
                this.updateValueInField();

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            modelValueIsSet: function() {
                var value = this.modelValue();
                if (_.isUndefined(value) || _.isNull(value) || value === '') {
                    return false;
                } else {
                    return !(_.isUndefined(this.optionForValue(value)));
                }
            },

            optionForValue: function(value) {
                return _.find(this.options.options, function(option) { return option[0] === value; });
            },

            fieldValue: function () {
                var value;
                if (this.editable === 'never') {
                    value = this.modelValueIsSet() ? this.modelValue () : null;
                }
                else {
                    value = this.$('.u-field-value select').val();
                }
                return value === '' ? null : value;
            },

            displayValue: function (value) {
                if (value) {
                    var option = this.optionForValue(value);
                    return (option ? option[1] : '');
                } else {
                    return '';
                }
            },

            updateValueInField: function () {
                if (this.editable !== 'never') {
                    this.$('.u-field-value select').val(this.modelValue() || '');
                }

                var value = this.displayValue(this.modelValue() || '');
                if (this.modelValueIsSet() === false) {
                    value = this.options.placeholderValue || '';
                }
                this.$('.u-field-value').attr('aria-label', this.options.title);
                this.$('.u-field-value-readonly').html(_.escape(value));

                if (this.mode === 'display') {
                    this.updateDisplayModeClass();
                }
            },

            saveValue: function () {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,this.fieldValue());
                this.updateResults(localModel);
            },

            showDisplayMode: function(render) {
                this._super(render);
                if (this.editable === 'toggle') {
                    this.$('.u-field-value a').focus();
                }
            },

            showEditMode: function(render) {
                this._super(render);
                if (this.editable === 'toggle') {
                    this.$('.u-field-value select').focus();
                }
            },

            saveSucceeded: function() {
                if (this.editable === 'toggle') {
                    this.showDisplayMode();
                }

                if (this.options.required && this.modelValueIsSet()) {
                    this.$('option[value=""]').remove();
                }

                this._super();
            },

            disableField: function(disable) {
                if (this.editable !== 'never') {
                    this.$('.u-field-value select').prop('disabled', disable);
                }
            }
        });

        FieldViews.SliderFieldView = FieldViews.EditableFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_slider_template,

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
                    /*view.$(".u-field-custom-slider-output").text(
                        gettext("You have changed to ") + view.options.levels[ui.value]
                    );*/
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
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,this.fieldValue());
                this.updateResults(localModel);
            }
        });

        FieldViews.SliderRangeFieldView = FieldViews.EditableFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_slider_range_template,


            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'afterRender');
                this.render = _.wrap(this.render, function(render) {
                  render.apply(this);
                  this.afterRender();
                  return this;
                });
            },

            range_values: {},

            render: function () {
                this.$el.html(this.template({
                    id: this.options.valueAttribute[2],
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
                var view = this;
                var silder_ = view.$(".u-field-custom-slider-" + this.options.valueAttribute[2]);
                silder_
                // Establecer los limites del slider
                .slider({
                      max: this.options.max,
                      min: this.options.min,
                      values: [500, 4000],
                      range: true,
                      slide: function(event, ui){
                        view.$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                      },
                  })
                // and whenever the slider changes, lets echo out
                .on("slidechange", function(e, ui) {
                    /*view.$(".u-field-custom-slider-output").text(
                        gettext("You have changed to ") + view.options.levels[ui.value]
                    );*/
                    view.saveValue();
                });
                this.$( "#amount" ).val( "$" + silder_.slider( "values", 0 ) + " - $" + silder_.slider( "values", 1 ) );

            },

            setValues: function () {
                var first_range = this.$(".u-field-custom-slider-" +
                                    this.options.valueAttribute[2]).slider("values", 0);
                var second_range = this.$(".u-field-custom-slider-" +
                                    this.options.valueAttribute[2]).slider("values", 1);
                this.range_values[this.options.valueAttribute[0]] = first_range;
                this.range_values[this.options.valueAttribute[1]] = second_range;
            },

            finishEditing: function(e, ui) {
                if (this.persistChanges === false || this.mode !== 'edit') {return;}
                if (parseInt(this.fieldValue()) !== this.modelValue()) {
                    this.saveValue();
                }
            },

            saveValue: function () {
              this.setValues();
              var localModel =this.model;
                localModel.set(this.options.valueAttribute[0],this.range_values[this.options.valueAttribute[0]]);
                localModel.set(this.options.valueAttribute[1],this.range_values[this.options.valueAttribute[1]]);
                this.updateResults(localModel);
            }

        });

        FieldViews.RadioFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_radio_template,

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

            deleteAttribute: function () {
              var localModel =this.model;
              localModel.unset(this.options.valueAttribute);
              this.updateResults(localModel);
            },

            updateValueInField: function () {
                if (this.editable !== 'never') {
                    this.$('input[type="radio"]').val([this.modelValue() || 0]);
                    this.$('input[type="radio"]:checked').parent().siblings().removeClass("success");
                    this.$('input[type="radio"]:checked').parent().toggleClass("success");
                }
            },

        });

        FieldViews.RadioNeutralFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_radio_neutral_template,

            initialize: function (options) {
                  this._super(options);
                  this.fields_lng =  new MultiFieldModel();
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
                    aling_inputs: this.options.aling_inputs,
                    editable: this.editable,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    iconName: this.options.iconName,
                    radioOptions: this.options.options,
                    message: this.helpMessage
                }));

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
              var dis= this;
              var opts = dis.options.options;
              var pre_value;
              var le_value;
              var le_input = this.$('input[type="checkbox"].square-green');
              setTimeout(function () {

              le_input.iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                    increaseArea: '10%' // optional
                });
              },500);
              le_input.on('ifChecked', function(event){
                pre_value = $(this).val();
                _.mapObject(opts, function(val, key) {
                  if(val[0] == pre_value){
                    dis.fields_lng.set(val[1],pre_value);
                  }
                });

                le_value=dis.fields_lng.getValuesComa();
                dis.saveValue(le_value);
              });
              le_input.on('ifUnchecked',function(event){
                pre_value = $(this).val();
                _.mapObject(opts, function(val, key) {
                  if(val[0] == pre_value){
                    dis.fields_lng.unset(val[1],pre_value);
                  }
                });
                if(_.isEmpty(dis.fields_lng.toJSON())){
                  dis.deleteAttribute();
                }else{
                  le_value=dis.fields_lng.getValuesComa();
                  dis.saveValue(le_value);
                }

              });

            },

            deleteAttribute: function () {
              var localModel =this.model;
              localModel.unset(this.options.valueAttribute);
              this.updateResults(localModel);
            },

            saveValue: function (el_val) {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,el_val);
                this.updateResults(localModel);
            },

        });

        FieldViews.RadioTypeFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',
            fieldTemplate: field_radio_type_template,

            initialize: function (options) {
                  this._super(options);
                  this.fields_lng =  new MultiFieldModel();
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
                    aling_inputs: this.options.aling_inputs,
                    editable: this.editable,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    iconName: this.options.iconName,
                    iconOptions: this.options.iconOptions,
                    radioOptions: this.options.options,
                    message: this.helpMessage
                }));

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },

            afterRender: function () {
              var dis= this;
              var opts = dis.options.options;
              var pre_value;
              var le_value;
              var le_input = this.$('input[type="checkbox"].square-green');
              setTimeout(function () {

              le_input.iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                    increaseArea: '10%' // optional
                });
              },500);
              le_input.on('ifChecked', function(event){
                pre_value = $(this).val();
                _.mapObject(opts, function(val, key) {
                  if(val[0] == pre_value){
                    dis.fields_lng.set(val[1],pre_value);
                  }
                });

                le_value=dis.fields_lng.getValuesComa();
                dis.saveValue(le_value);
              });
              le_input.on('ifUnchecked',function(event){
                pre_value = $(this).val();
                _.mapObject(opts, function(val, key) {
                  if(val[0] == pre_value){
                    dis.fields_lng.unset(val[1],pre_value);
                  }
                });
                if(_.isEmpty(dis.fields_lng.toJSON())){
                  dis.deleteAttribute();
                }else{
                  le_value=dis.fields_lng.getValuesComa();
                  dis.saveValue(le_value);
                }

              });

            },

            deleteAttribute: function () {
              var localModel =this.model;
              localModel.unset(this.options.valueAttribute);
              this.updateResults(localModel);
            },

            saveValue: function (el_val) {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,el_val);
                this.updateResults(localModel);
            },

        });

        FieldViews.RadioCategoriesFieldView = FieldViews.DropdownFieldView.extend({

            helpMessage: '',
            tagName: 'div',

            fieldTemplate: field_radio_categories_template,

            initialize: function (options) {

                this._super(options);
                this.fields_cat = new MultiFieldModel();
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
                    aling_inputs: this.options.aling_inputs,
                    editable: this.editable,
                    title: this.options.title,
                    screenReaderTitle: this.options.screenReaderTitle || this.options.title,
                    titleVisible: this.options.titleVisible !== undefined ? this.options.titleVisible : true,
                    iconName: this.options.iconName,
                    radioOptions: this.options.options,
                    message: this.helpMessage
                }));

                if (this.editable === 'toggle') {
                    this.showCanEditMessage(this.mode === 'display');
                }
                return this;
            },
            afterRender: function () {
              var dis= this;
              var opts = dis.options.options;
              var pre_value;
              var le_value;
              var le_input = this.$('input[type="checkbox"].square-green');
              setTimeout(function () {

              le_input.iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                    increaseArea: '10%' // optional
                });
              },500);
              le_input.on('ifChecked', function(event){
                pre_value = $(this).val();

                _.mapObject(opts, function(val, key) {
                  _.mapObject(val[3], function (val_,key_) {
                    if(val_[0] == pre_value){
                      dis.fields_cat.set(val_[1],pre_value);
                    }
                  })

                });

                le_value=dis.fields_cat.getValuesComa();
                dis.saveValue(le_value);
              });
              le_input.on('ifUnchecked',function(event){
                pre_value = $(this).val();
                _.mapObject(opts, function(val, key) {
                  _.mapObject(val[3], function (val_,key_) {
                    if(val_[0] == pre_value){
                      dis.fields_cat.unset(val_[1],pre_value);
                    }
                  })

                });
                if(_.isEmpty(dis.fields_cat.toJSON())){
                  dis.deleteAttribute();
                }else{
                  le_value=dis.fields_cat.getValuesComa();
                  dis.saveValue(le_value);
                }

              });

            },

            deleteAttribute: function () {
              var localModel =this.model;
              localModel.unset(this.options.valueAttribute);
              this.updateResults(localModel);
            },

            saveValue: function (el_val) {
              var localModel =this.model;
                localModel.set(this.options.valueAttribute,el_val);
                this.updateResults(localModel);
            },

        });


        return FieldViews;
    });

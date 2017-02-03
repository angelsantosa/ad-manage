;(function (define) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'js/views/fields_custom',
        'text!templates/fields_custom/field_gmap.underscore',
        'backbone-super'
    ], function (gettext, $, _, Backbone, FieldViews, field_gmap_template) {

        var GMapFieldView = FieldViews.FieldView.extend({

            modelValueState: function () {},
            modelValueCountry: function () {},

            fieldType: 'gmap',

            fieldTemplate: field_gmap_template,

            useGeocode: true,

            errorMessage: gettext("An error has occurred. Refresh the page, and then try again."),

            initialize: function (options) {
                this._super(options);
                _.bindAll(this, 'render', 'modelValueState', 'modelValueCountry', 'afterRender');
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
                    message: this.options.helpMessage,
                    state: this.modelValueState(),
                    country: this.modelValueCountry(),
                    showTitle: true
                }));
                this.delegateEvents();
                return this;
            },

            afterRender: function () {
                var map = new GMaps({
                  el: this.$('.gmap-wrapper').get(0),
                  width: 400,
                  height: 300,
                  zoom: 13,
                  lat: 19.4326077,
                  lng: -99.13320799999997,
                });

                if (!this.useGeocode) {

                    map.drawCircle({
                      lat: 19.4326077,
                      lng: -99.13320799999997,
                      radius: 2000,    // 2km in metres
                      strokeColor: "#D7DF23",
                      strokeOpacity: 0.0,
                      strokeWeight: 0,
                      fillColor: "#D7DF23",
                      fillOpacity: 0.35,
                    });

                    map.drawCircle({
                      lat: 19.4326077,
                      lng: -99.13320799999997,
                      radius: 2200,    // 2.1km in metres
                      strokeColor: "#D7DF23",
                      strokeOpacity: 1.0,
                      strokeWeight: 8,
                      fillColor: "#D7DF23",
                      fillOpacity: 0.0,
                    });
                } else {
                    console.log("geocode");
                    GMaps.geocode({
                      address: this.modelValue(),
                      callback: function(results, status) {
                        if (status == 'OK') {
                          var latlng = results[0].geometry.location;
                          map.setCenter(latlng.lat(), latlng.lng());

                            map.drawCircle({
                              lat: latlng.lat(),
                              lng: latlng.lng(),
                              radius: 2000,    // 2km in metres
                              strokeColor: "#D7DF23",
                              strokeOpacity: 0.0,
                              strokeWeight: 0,
                              fillColor: "#D7DF23",
                              fillOpacity: 0.35,
                            });

                            map.drawCircle({
                              lat: latlng.lat(),
                              lng: latlng.lng(),
                              radius: 2200,    // 2.1km in metres
                              strokeColor: "#D7DF23",
                              strokeOpacity: 1.0,
                              strokeWeight: 8,
                              fillColor: "#D7DF23",
                              fillOpacity: 0.0,
                            });
                        }
                      }
                    });
                }
            }
        });

        return GMapFieldView;
    });
}).call(this, define || RequireJS.define);

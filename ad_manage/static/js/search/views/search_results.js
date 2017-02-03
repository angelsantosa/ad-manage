define([
    'gettext', 'jquery', 'underscore', 'backbone', 'logger',
    'googlemaps','gmaps',
    'text!templates/search/search.underscore',
    'jquery-ui','bootstrap','holder','iCheck','bootstrap-star-rating','bootstrap-daterangepicker','jquery-ui-slider-pips'
    ],

    function(gettext, $, _, Backbone, Logger, googleMaps, GMaps, searchTemplate) {

        var ResultMapsElement = $(".search-results-map");
        var ResultCardElement= $(".search-results");

        ResultsView = Backbone.View.extend({

            events: {},

            initialize: function(){
                _.bindAll(this, 'render', 'afterRender');

            },

            render: function(){


            },




        });


    return ResultsView;

});

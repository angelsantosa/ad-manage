requirejs.config({
  // appDir: '/static/echarli.app/',
  baseUrl: '/static/js',
  // Set paths
  paths:{
    async: 'lib/async',
    text: 'lib/text',
    'gettext':                      ['/i18n'],
    // 'googlemaps':                ['js/plugins/googlemaps/googlemaps'],
    'googlemaps':                   ['plugins/googlemaps/googlemaps-amd'],
    'gmaps':                        ['plugins/gmaps/gmaps.min'],
    'jquery-geocomplete':           ['plugins/jquery-geocomplete/jquery.geocomplete.min'],

    //angular shit
    'angular':                      ['core/angular/angular.min'],
    'angular-route':                ['core/angular/angular-route.min'],
    //backbone shit
    'backbone':                     ['core/backbone/backbone-min'],
    'backbone-super':               ['core/backbone/backbone-super-min'],
    'backbone.modal':               ['plugins/backbone.modal/backbone.modal'],
    'logger':                       ['core/logger/logger.min'],
    'underscore':                   ['core/underscore/underscore-min'],

    'bootstrap':                    ['core/bootstrap/bootstrap.min'],
    'jquery':                       ['core/jquery/jquery-2.2.1.min'],
    'jquery-ui':                    ['plugins/jquery-ui/jquery-ui.min'],
    'holder':                       ['plugins/holder/holder.min'],
    'iCheck':                       ['plugins/icheck/icheck.min'],
    'moment':                       ['plugins/moment/moment.min'],


    'bootstrap-star-rating':        ['plugins/bootstrap-star-rating/star-rating.min'],
    'bootstrap-daterangepicker':    ['plugins/bootstrap-daterangepicker/daterangepicker'],
    'jquery-ui-slider-pips':        ['plugins/jquery-ui-slider-pips/jquery-ui-slider-pips.min'],

    //app plugins
    //'index':                 ['js/index']
    //'logistration-factory':   ['js/account/logistration_factory'],
  },
  googlemaps: {
    params: {
        url: 'http://maps.google.com/maps/api/js',
        key: 'AIzaSyBVLQuAQOiy9LeRqy6MyE3Y2NW1VHTLsBM',
        libraries: 'places'
    }
  },
  // Set dependencies
  shim: {
    'jquery': {
      exports: '$'
    },
    'jquery-ui': {
      deps: ['jquery'],
    },
    'angular': {
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular'],
    },
    'backbone': {
      deps:['underscore','jquery'],
      exports: 'Backbone'
    },
    'backbone-super': {
      deps:['backbone'],
    },
    'underscore': {
      exports: '_'
    },
    'bootstrap': {
      deps: ['jquery'],
    },
    'iCheck':{
      deps: ['jquery'],
    },
    'logistration-factory': {
      deps:['jquery'],
	  },
    'bootstrap-star-rating':{
      deps: ['jquery','bootstrap'],
    },
    'bootstrap-daterangepicker':{
      deps: ['jquery','bootstrap','moment'],
    },
    'jquery-ui-slider-pips':{
        deps: ['jquery','jquery-ui'],
    },
    'gmaps': {
        deps: ['googlemaps'],
        exports: 'GMaps',
    },
    'gettext': {
        exports: 'gettext',
    },
    'jquery-geocomplete': {
        deps: ['googlemaps','jquery'],
        exports: 'geocomplete',
    },
    /*
    ''
    'index': {
      deps:['jquery'],
    },*/

  }
});

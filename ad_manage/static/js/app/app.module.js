(function() {
    'use strict';

    angular
        .module('echarliApp', [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            // 'ngAria',
            'ui.router',
            'ngCacheBuster',
            'ui.bootstrap',
            // 'angular-loading-bar'
        ])
        .run(run);

    run.$inject = ['stateHandler', 'translationHandler'];

    function run(stateHandler, translationHandler) {
        stateHandler.initialize();
        translationHandler.initialize();
    }

})();

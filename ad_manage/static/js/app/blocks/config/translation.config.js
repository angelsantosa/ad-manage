(function() {
    'use strict';

    angular
        .module('echarliApp')
        .config(translationConfig);

    translationConfig.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider'];

    function translationConfig($translateProvider, tmhDynamicLocaleProvider) {
        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/static/i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('es');
        $translateProvider.useStorage('translationStorageProvider');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('/static/i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');
    }
})();

(function() {
    'use strict';

    angular
        .module('echarliApp')
        .controller('EchLanguageController', EchLanguageController);

    EchLanguageController.$inject = ['$translate', 'EchLanguageService', 'tmhDynamicLocale'];

    function EchLanguageController ($translate, EchLanguageService, tmhDynamicLocale) {
        var vm = this;

        vm.changeLanguage = changeLanguage;
        vm.languages = null;

        EchLanguageService.getAll().then(function (languages) {
            vm.languages = languages;
        });

        function changeLanguage (languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
        }
    }
})();

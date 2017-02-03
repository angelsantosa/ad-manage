(function() {
    'use strict';

    angular
        .module('echarliApp')
        .directive('echSortBy', echSortBy);

    function echSortBy() {
        var directive = {
            restrict: 'A',
            scope: false,
            require: '^echSort',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs, parentCtrl) {
            element.bind('click', function () {
                parentCtrl.sort(attrs.echSortBy);
            });
        }
    }
})();

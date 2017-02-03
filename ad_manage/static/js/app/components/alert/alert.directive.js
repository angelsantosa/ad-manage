(function() {
    'use strict';

    var echAlert = {
        template: '<div class="alerts" ng-cloak="">' +
                        '<div ng-repeat="alert in $ctrl.alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                            '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close($ctrl.alerts)"><pre ng-bind-html="alert.msg"></pre></uib-alert>' +
                        '</div>' +
                  '</div>',
        controller: echAlertController
    };

    angular
        .module('echarliApp')
        .component('echAlert', echAlert);

    echAlertController.$inject = ['$scope', 'AlertService'];

    function echAlertController($scope, AlertService) {
        var vm = this;

        vm.alerts = AlertService.get();
        $scope.$on('$destroy', function () {
            vm.alerts = [];
        });
    }
})();

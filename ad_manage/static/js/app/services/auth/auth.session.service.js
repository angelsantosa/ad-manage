(function() {
    'use strict';

    angular
        .module('echarliApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage'];

    function AuthServerProvider ($http, $localStorage) {
        var service = {
            getToken: getToken,
            hasValidToken: hasValidToken,
            login: login,
            logout: logout
        };

        return service;

        function getToken () {
            var token = $localStorage.authenticationToken;
            return token;
        }

        function hasValidToken () {
            var token = this.getToken();
            return !!token;
        }

        function login (credentials) {
            return $http.post('/rest-auth/login/', credentials, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (response) {
                return response;
            });
        }

        function logout () {

            // logout from the server
            $http.post('/api-auth/logout/').success(function (response) {
                delete $localStorage.authenticationToken;
                // to get a new csrf token call the api
                $http.get('/rest-auth/user/');
                return response;
            });

        }
    }
})();

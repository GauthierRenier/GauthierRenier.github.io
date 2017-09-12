'use strict';

(function (angular) {
    angular.module('quickscan').factory('Env', ['$location', 'ENV', function ($location, ENV) {

        return {
            apiRoot: apiRoot
        };

        function apiRoot() {
            if ($location.host().toLowerCase() === 'localhost') {
                // We are serving from Gulp! The port for the REST APIROOT must be adapted;
                return 'http://localhost:8080' + ENV.REST.APIROOT;
            } else {
                return ENV.REST.APIROOT
            }
        }
    }]);
})(angular);
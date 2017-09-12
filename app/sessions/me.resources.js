'use strict';

(function (angular) {
    angular.module('quickscan').factory('Me', ['$resource', 'Env', function ($resource, Env) {

        var apiRoot = Env.apiRoot() + '/me';
        var resources = $resource(apiRoot, {}, {
            get: {method: 'GET'}
        });

        return {
            getMe: getMe
        };

        function getMe() {
            return resources.get().$promise;
        }
    }]);
})(angular);

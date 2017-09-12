'use strict';

(function (angular) {
    angular.module('quickscan').factory('Sessions', ['$q', 'Me', function ($q, Me) {

        return {
            isLogged: isLogged
        };

        function isLogged() {
            return Me.getMe().then(function () {
                return true;
            }).catch(function (rejection) {
                return rejection.status === 404 ? false : $q.reject(rejection);
            });
        }
    }]);
})(angular);

'use strict';


(function (angular) {
    angular.module('quickscan').factory('$exceptionHandler', ['$injector', '$log', function ($injector, $log) {

        var Exceptions;

        return function(exception, cause) {

            if (!Exceptions) {
                Exceptions = $injector.get('Exceptions');
            }

            $log.error('exception:', exception, 'cause:', cause);

            Exceptions.handleMessage('error.unexpected');
        };
    }]);

})(angular);

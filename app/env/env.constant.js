'use strict';

(function (angular) {
    angular.module('quickscan').constant('ENV', {
        REST: {
            APIROOT: 'https://acc.saviscio.be/survey'
        }
    });
})(angular);
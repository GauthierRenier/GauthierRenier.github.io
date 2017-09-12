'use strict';

(function (angular) {
    angular.module('quickscan').factory('Answers', function () {

        return {
            marshall: marshall
        };

        function marshall(object) {
            var answer = {
                timestamp: Date.now(),
                values: []
            };
            Object.keys(object).forEach(function(key) {
                answer.values.push(object[key]);
            });
            return answer;
        }
    });
})(angular);
'use strict';

(function (angular) {
    angular.module('quickscan').factory('Survey', function () {

        var Survey = {
            countAnswers: countAnswers,
            data: undefined,
            isEmpty: isEmpty,
            isStarted: isStarted,
            key: undefined,
            language: undefined
        };
        return Survey;

        function countAnswers() {
            return Object.keys(Survey.data.answers).filter(function (id) {
                var answer = Survey.data.answers[id];
                return answer && answer.values && answer.values.length > 0;
            }).length;
        }

        function isEmpty() {
            return !Survey.key || !Survey.language || !Survey.data
        }

        function isStarted() {
            return Survey.data.answers && Object.keys(Survey.data.answers).length > 0;
        }
    });
})(angular);

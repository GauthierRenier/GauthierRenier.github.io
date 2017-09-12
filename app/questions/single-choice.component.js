'use strict';

(function (angular) {
    angular.module('quickscan').component('qSingleChoice', {
        bindings: {
            answer: '=',
            formName: '<',
            language: '<',
            question: '='
        },
        templateUrl: 'app/questions/single-choice.template.html',
        controller: ['$scope', function($scope) {
            var ctrl = this;

            $scope.isInvalid = isInvalid;
            $scope.isValid = isValid;
            $scope.clearValue = clearValue;

            function isInvalid() {
                return ctrl.answer === undefined || ctrl.answer.length === 0;
            }

            function isValid() {
                return !isInvalid();
            }

            function clearValue() {
                ctrl.answer = undefined;
            }
        }]
    })
})(angular);

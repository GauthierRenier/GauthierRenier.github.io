'use strict';

(function (angular) {
    angular.module('quickscan').component('qDegree', {
        bindings: {
            answer: '=',
            formName: '<',
            language: '<',
            question: '='
        },
        templateUrl: 'app/questions/degree.template.html',
        controller: ['$scope', function($scope) {
            var ctrl = this;

            $scope.vm = {
                amountOfDegrees: undefined,
                degreeTitles: [],
                hoveredValue: undefined,
                value: undefined
            };

            $scope.clearValue = clearValue;
            $scope.correctedValue = valueToAnswer;
            $scope.hovering = hovering;
            $scope.isInvalid = isInvalid;
            $scope.isValid = isValid;
            $scope.leaving = leaving;

            ctrl.$onInit = function() {
                $scope.vm.amountOfDegrees = ctrl.question.maxValue - ctrl.question.minValue + 1;
                $scope.vm.degreeTitles = [];
                for (var i = ctrl.question.minValue; i <= ctrl.question.maxValue; i++) {
                    $scope.vm.degreeTitles.push(i);
                }
                $scope.vm.value = answerToValue(ctrl.answer);

                $scope.$watch('vm.value', function (value) {
                    ctrl.answer = valueToAnswer(value);
                });
            };

            function answerToValue(answer) {
                return answer !== undefined ? (answer + 1) : undefined;
            }

            function clearValue() {
                ctrl.answer = undefined;
                $scope.vm.value = undefined;
            }

            function hovering(value) {
                $scope.vm.hoveredValue = value;
            }

            function isInvalid() {
                return $scope[ctrl.formName].$invalid;
            }

            function isValid() {
                return !isInvalid();
            }

            function leaving() {
                $scope.vm.hoveredValue = undefined;
            }

            function valueToAnswer(value) {
                return value !== undefined ? value - 1 : undefined;
            }
        }]
    })
})(angular);

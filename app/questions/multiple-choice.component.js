'use strict';

(function (angular) {
    angular.module('quickscan').component('qMultipleChoice', {
        bindings: {
            answer: '=',
            formName: '<',
            language: '<',
            question: '='
        },
        templateUrl: 'app/questions/multiple-choice.template.html',
        controller: ['$scope', function($scope) {
            var ctrl = this;

            $scope.vm = {
                answers: {}
            };

            $scope.isInvalid = isInvalid;
            $scope.isValid = isValid;

            ctrl.$onInit = function () {

                if (ctrl.answer) {
                    ctrl.answer.forEach(function (value) {
                        $scope.vm.answers['' + value] = true;
                    });
                }

                $scope.$watchCollection('vm.answers', function (newAnswers) {
                    ctrl.answer = Object.keys(newAnswers).filter(function (key) {
                        return newAnswers[key];
                    });
                });
            };

            function isInvalid() {
                return ctrl.answer.length === 0;
            }

            function isValid() {
                return !isInvalid();
            }
        }]
    })
})(angular);

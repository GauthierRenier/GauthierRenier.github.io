'use strict';

(function (angular) {
    angular.module('quickscan').component('qProceed', {
        bindings: {
            answer: '=',
            answerEmployability: '=',
            language: '<',
            question: '=',
            questionEmployability: '='
        },
        templateUrl: 'app/questions/proceed.template.html',
        controller: ['$attrs', '$scope', function($attrs, $scope) {
            var ctrl = this;

            ctrl.areOptionsInvalid = areOptionsInvalid;
            ctrl.areEmployabilityOptionsInvalid = areEmployabilityOptionsInvalid;
            ctrl.isReasonInvalid = isReasonInvalid;
            ctrl.isReasonRequired = isReasonRequired;

            init();

            function areOptionsInvalid() {
                if ($scope[ctrl.name] && $scope[ctrl.name].proceedOptions) {
                    return $scope[ctrl.name].proceedOptions.$invalid;
                }
                return false;
            }

            function areEmployabilityOptionsInvalid() {
                if ($scope[ctrl.name] && $scope[ctrl.name].employabilityOptions) {
                    return $scope[ctrl.name].employabilityOptions.$invalid;
                }
                return false;
            }

            function init() {
                // Grab the name in the component attributes and use it for the ng-form
                if ($attrs.name) {
                    ctrl.name = $attrs.name;
                }
            }

            function isReasonInvalid() {
                if ($scope[ctrl.name] && $scope[ctrl.name].reason) {
                    return $scope[ctrl.name].reason.$invalid;
                }
                return false;
            }

            function isReasonRequired() {
                if (ctrl && ctrl.answer && ctrl.answer.value) {
                    return ctrl.answer.value === ctrl.question.candidateAnswers[0].id;
                }
                return false;
            }
        }]
    });
})(angular);

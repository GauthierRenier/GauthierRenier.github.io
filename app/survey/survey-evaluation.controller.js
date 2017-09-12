'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyEvaluationCtrl', ['$location', '$scope', 'Exceptions', 'Survey', 'SurveyRuns', function ($location, $scope, Exceptions, Survey, SurveyRuns) {

        $scope.vm = {
            evaluation: {
                helper: undefined,
                problem: undefined,
                reason: undefined
            }
        };

        $scope.back = back;
        $scope.isEvaluationSelected = isEvaluationSelected;
        $scope.isEvaluationValid = isEvaluationValid;
        $scope.isHelperInvalid = isHelperInvalid;
        $scope.isHelperRequired = isHelperRequired;
        $scope.isReasonInvalid = isReasonInvalid;
        $scope.isReasonRequired = isReasonRequired;
        $scope.next = next;

        function back() {
            $location.url('/questionnaire')
        }

        function isEvaluationSelected() {
            return $scope.vm.evaluation.problem !== undefined;
        }

        function isEvaluationValid() {
            return $scope.surveyEvaluationForm.$valid;
        }

        function isHelperInvalid() {
            return $scope.surveyEvaluationForm.helper.$invalid;
        }

        function isHelperRequired() {
            return $scope.vm.evaluation.problem && !$scope.vm.evaluation.helper;
        }

        function isReasonInvalid() {
            return $scope.surveyEvaluationForm.reason.$invalid;
        }

        function isReasonRequired() {
            return $scope.vm.evaluation.problem && !$scope.vm.evaluation.reason;
        }

        function next() {
            SurveyRuns.updateSurveyEvaluation(Survey.key, $scope.vm.evaluation).then(function () {

                return SurveyRuns.updateSurveyStatus(Survey.key, 'CLOSED');
            }).then(function() {
                $location.url('/done');

            }).catch(function (rejection) {
                Exceptions.handleMessage('survey.evaluation.error.updateEvaluation', rejection);
            });
        }
    }]);
})(angular);

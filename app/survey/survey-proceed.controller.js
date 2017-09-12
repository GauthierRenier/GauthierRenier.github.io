'use strict';

(function (angular) {
    angular.module('quickscan').controller('SurveyProceedCtrl', ['$location', '$q', '$scope', 'Answers', 'Exceptions', 'Survey', 'SurveyRuns', function ($location, $q, $scope, Answers, Exceptions, Survey, SurveyRuns) {

        $scope.vm = {
            answer: undefined,
            answerEmployability: undefined,
            language: Survey.language,
            question: undefined,
            questionEmployability: undefined
        };

        $scope.proceed = proceed;

        init();

        function init() {
            SurveyRuns.getSurveyQuestion(Survey.key, 0).then(function (question) {
                $scope.vm.questionEmployability = question;
                return SurveyRuns.getSurveyQuestion(Survey.key, 1);
            }).then(function (question) {
                $scope.vm.question = question;
            }).catch(function (rejection) {
                Exceptions.handleMessage('survey.initialization.error.questionNotFound', rejection);
            });
        }

        function proceed() {
            if ($scope.surveyProceedForm.$valid) {

                SurveyRuns.saveSurveyQuestionAnswer(Survey.key, 0, Answers.marshall($scope.vm.answerEmployability)).then(function() {
                    return SurveyRuns.saveSurveyQuestionAnswer(Survey.key, 1, Answers.marshall($scope.vm.answer));
                }).then(function() {
                    if ($scope.vm.answer.value === 2) {
                        $location.url('/questionnaire');
                    } else {
                        SurveyRuns.updateSurveyStatus(Survey.key, 'CLOSED').then(function () {
                            $location.url('/done');

                        }).catch(function (rejection) {
                            Exceptions.handleRejection(rejection);
                        });
                    }
                }).catch(function (rejection) {
                    Exceptions.handleRejection(rejection);
                });
            }
        }
    }]);
})(angular);

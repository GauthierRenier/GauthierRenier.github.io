'use strict';

(function (angular) {
    angular.module('quickscan').factory('SurveyRuns', ['$resource', 'Env', function ($resource, Env) {

        var apiRoot = Env.apiRoot() + '/survey-runs';
        var resources = $resource(apiRoot, {}, {
            changeStatus: {method: 'PUT', url: apiRoot + '/:key/status/:status'},
            get: {method: 'GET', url: apiRoot + '/:key'},
            getQuestion: {method: 'GET', url: apiRoot + '/:key/questions/:questionId'},
            getQuestions: {method: 'GET', url: apiRoot + '/:key/questions', isArray: true},
            saveEvaluation: {method: 'PUT', url: apiRoot + '/:key/evaluation'},
            saveQuestionAnswer: {method: 'POST', url: apiRoot + '/:key/questions/:questionId/answers'}
        });

        return {
            getSurvey: getSurvey,
            getSurveyQuestion: getSurveyQuestion,
            getSurveyQuestions: getSurveyQuestions,
            saveSurveyQuestionAnswer: saveSurveyQuestionAnswer,
            updateSurveyEvaluation: updateSurveyEvaluation,
            updateSurveyStatus: updateSurveyStatus
        };

        function getSurvey(key, language) {
            return resources.get({key: key, l: language}).$promise;
        }

        function getSurveyQuestion(key, questionId) {
            return resources.getQuestion({key: key, questionId: questionId}).$promise;
        }

        function getSurveyQuestions(key) {
            return resources.getQuestions({key: key}).$promise;
        }

        function saveSurveyQuestionAnswer(key, questionId, answer) {
            return resources.saveQuestionAnswer({key: key, questionId: questionId}, answer).$promise;
        }

        function updateSurveyEvaluation(key, evaluation) {
            return resources.saveEvaluation({key: key}, evaluation).$promise;
        }

        function updateSurveyStatus(key, status) {
            return resources.changeStatus({key: key, status: status}, {}).$promise;
        }
    }]);
})(angular);